<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AdmissionStatusMail;
use App\Models\Admission;
use App\Models\Certificate;
use App\Models\Nationality;
use App\Models\Program;
use App\Services\VerifiedStudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Admission::with(['program', 'countryCode', 'nationality'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Admissions/Index', [
            'admissions' => $query->paginate(15)->through(fn (Admission $admission) => [
                'id' => $admission->id,
                'full_name' => $admission->full_name,
                'email' => $admission->email,
                'phone' => $admission->phone,
                'nationality' => $admission->nationality?->name,
                'program_id' => $admission->program_id,
                'program_title' => $admission->program_title,
                'status' => $admission->status,
                'created_at' => $admission->created_at,
            ])->withQueryString(),
            'filters' => $request->only(['status', 'search']),
            'total_applications' => Admission::count(),
        ]);
    }

    public function show(Admission $admission, VerifiedStudentService $verifiedStudentService)
    {
        $admission->load(['program', 'countryCode', 'nationality']);

        $availableCertificates = Certificate::with('program')
            ->whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->orderBy('certificate_number')
            ->get(['id', 'program_id', 'certificate_number'])
            ->groupBy(fn (Certificate $certificate) => (string) $certificate->program_id)
            ->map(fn ($group) => $group->values());

        return Inertia::render('Admin/Admissions/Show', [
            'admission' => [
                'id' => $admission->id,
                'full_name' => $admission->full_name,
                'email' => $admission->email,
                'phone' => $admission->phone,
                'country_code_id' => $admission->country_code_id,
                'phone_country_code' => $admission->countryCode?->dial_code,
                'nationality' => $admission->nationality?->name,
                'nationality_id' => $admission->nationality_id,
                'program_id' => $admission->program_id,
                'program_title' => $admission->program_title,
                'education_history' => $admission->education_history,
                'english_qualifications' => $admission->english_qualifications,
                'declaration_accepted' => $admission->declaration_accepted,
                'status' => $admission->status,
                'created_at' => $admission->created_at,
            ],
            'nationalities' => Nationality::orderBy('name')->get(['id', 'name']),
            'programs' => Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'next_student_id' => $verifiedStudentService->nextStudentId(),
            'available_certificates' => $availableCertificates,
        ]);
    }

    public function updateStatus(Request $request, Admission $admission)
    {
        $request->validate(['status' => 'required|in:pending,reviewed,accepted,rejected']);

        $oldStatus = $admission->status;
        $newStatus = $request->status;

        $admission->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            try {
                Mail::to($admission->email)->send(new AdmissionStatusMail($admission->loadMissing('program'), $newStatus));
            } catch (\Throwable $e) {
                report($e);

                return back()->with('error', 'Status updated, but the notification email could not be sent.');
            }
        }

        return back()->with('success', 'Status updated and notification sent.');
    }
}
