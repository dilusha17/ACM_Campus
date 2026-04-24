<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Program;
use App\Models\StudentProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $query = Certificate::with(['studentProgram.verifiedStudent', 'studentProgram.program', 'program'])->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('certificate_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('studentProgram.verifiedStudent', function ($q2) use ($request) {
                      $q2->where('full_name', 'like', '%' . $request->search . '%')
                         ->orWhere('student_id', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('assigned')) {
            if ($request->assigned === 'yes') {
                $query->whereHas('studentProgram');
            } elseif ($request->assigned === 'no') {
                $query->whereDoesntHave('studentProgram');
            }
        }

        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $query->paginate(20)->withQueryString()->through(function ($cert) {
                return [
                    'id'                 => $cert->id,
                    'certificate_number' => $cert->certificate_number,
                    'program_slug'       => $cert->program_slug,
                    'program_title'      => $cert->program?->title ?? $cert->studentProgram?->program?->title ?? $cert->program_slug,
                    'issue_date'         => $cert->issue_date,
                    'level'              => $cert->level,
                    'status'             => $cert->status,
                    'assigned'           => $cert->studentProgram !== null,
                    'student'            => $cert->student ? [
                        'id'         => $cert->student->id,
                        'student_id' => $cert->student->student_id,
                        'full_name'  => $cert->student->full_name,
                    ] : null,
                ];
            }),
            'filters' => $request->only(['search', 'status', 'assigned']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Certificates/Create', [
            'programs'            => Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'recent_certificates' => Certificate::with('program')
                ->whereDoesntHave('studentProgram')
                ->latest()
                ->take(30)
                ->get()
                ->map(fn ($c) => [
                    'id'                 => $c->id,
                    'certificate_number' => $c->certificate_number,
                    'program_slug'       => $c->program_slug,
                    'program_title'      => $c->program?->title ?? $c->program_slug,
                    'level'              => $c->level,
                ]),
        ]);
    }

    /**
     * Preview-only certificate number generation (GET, no DB writes).
     */
    public function generateNumber(Request $request)
    {
        $request->validate([
            'program_slug' => 'required|string',
            'year'         => 'required|digits:4',
        ]);

        $slug   = strtoupper(str_replace('-', '', $request->program_slug));
        $year   = $request->year;
        $prefix = 'ACM-' . $year . '-' . $slug . '-';

        $seq = Certificate::where('certificate_number', 'like', $prefix . '%')->count() + 1;

        return response()->json([
            'certificate_number' => $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_slug'   => 'required|exists:programs,slug',
            'graduated_year' => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),
            'level'          => 'required|in:Degree,Diploma,Certificate,Master,PhD',
        ]);

        $slug   = strtoupper(str_replace('-', '', $data['program_slug']));
        $year   = $data['graduated_year'];
        $prefix = 'ACM-' . $year . '-' . $slug . '-';

        $certNumber = null;

        DB::transaction(function () use ($data, $slug, $year, $prefix, &$certNumber) {
            $seq = Certificate::where('certificate_number', 'like', $prefix . '%')
                ->lockForUpdate()
                ->count() + 1;

            $certNumber = $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);

            while (Certificate::where('certificate_number', $certNumber)->exists()) {
                $seq++;
                $certNumber = $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
            }

            Certificate::create([
                'program_slug'       => $data['program_slug'],
                'certificate_number' => $certNumber,
                'issue_date'         => now()->toDateString(),
                'level'              => $data['level'],
                'status'             => 'active',
            ]);
        });

        return redirect()->route('admin.certificates.create')
            ->with('success', 'Certificate created: ' . $certNumber)
            ->with('created_certificate', $certNumber);
    }

    public function show(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Show', [
            'certificate' => $certificate->load('studentProgram.verifiedStudent'),
        ]);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $request->validate(['status' => 'required|in:active,revoked']);
        $certificate->update(['status' => $request->status]);

        return back()->with('success', 'Certificate status updated.');
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate deleted.');
    }
}
