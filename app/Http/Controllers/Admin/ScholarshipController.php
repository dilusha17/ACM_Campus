<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ScholarshipStatusMail;
use App\Models\Certificate;
use App\Models\Nationality;
use App\Models\Program;
use App\Models\ScholarshipApplication;
use App\Models\StudentDetailRequest;
use App\Services\VerifiedStudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $query = ScholarshipApplication::with('program')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('scheme')) {
            $query->where('scheme', $request->scheme);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Scholarships/Index', [
            'applications' => $query->paginate(15)->withQueryString(),
            'filters'      => $request->only(['status', 'scheme', 'search']),
        ]);
    }

    public function show(ScholarshipApplication $application, VerifiedStudentService $verifiedStudentService)
    {
        $availableCertificates = Certificate::whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->orderBy('certificate_number')
            ->get(['id', 'program_id', 'certificate_number'])
            ->groupBy(fn (Certificate $certificate) => (string) $certificate->program_id)
            ->map(fn ($group) => $group->values());

        return Inertia::render('Admin/Scholarships/Show', [
            'application' => $application->load('program'),
            'detail_request' => StudentDetailRequest::adminPayload(StudentDetailRequest::with('countryCode')->where('scholarship_application_id', $application->id)->latest()->first()),
            'nationalities' => Nationality::orderBy('name')->get(['id', 'name']),
            'programs' => Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'next_student_id' => $verifiedStudentService->nextStudentId(),
            'available_certificates' => $availableCertificates,
        ]);
    }

    public function updateStatus(Request $request, ScholarshipApplication $application)
    {
        $request->validate(['status' => 'required|in:pending,reviewed,approved,rejected']);

        $oldStatus = $application->status;
        $newStatus = $request->status;

        $application->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            $detailRequest = null;
            if ($newStatus === 'approved') {
                try {
                    $detailRequest = StudentDetailRequest::issueFor($application);
                } catch (\Throwable $e) {
                    report($e);
                }
            }

            try {
                Mail::to($application->email)->send(new ScholarshipStatusMail($application->loadMissing('program'), $newStatus, $detailRequest));
            } catch (\Throwable $e) {
                report($e);

                return back()->with('error', 'Status updated, but the notification email could not be sent.');
            }
        }

        return back()->with('success', 'Status updated and notification sent.');
    }
}
