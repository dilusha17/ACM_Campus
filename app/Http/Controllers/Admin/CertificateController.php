<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Program;
use App\Models\StudentProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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
                    'certificate_sample' => $cert->certificate_sample,
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
                    'program_id'         => $c->program_id,
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
            'program_id'   => 'required|exists:programs,id',
            'year'         => 'required|digits:4',
        ]);

        $program = Program::findOrFail($request->program_id);
        $slug   = strtolower($program->slug);
        $year   = $request->year;
        $prefix = 'acm-' . $year . '-' . $slug . '-';

        $seq = Certificate::where('certificate_number', 'like', $prefix . '%')->count() + 1;

        return response()->json([
            'certificate_number' => $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT),
        ]);
    }

    public function available(Request $request)
    {
        $request->validate(['programme' => 'required|integer|exists:programs,id']);

        $certs = Certificate::whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->where('program_id', $request->programme)
            ->orderByDesc('certificate_number')
            ->get(['id', 'certificate_number', 'program_id']);

        return response()->json($certs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id'     => 'required|exists:programs,id',
            'graduated_year' => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),
            'level'          => 'required|in:Degree,Diploma,Certificate,Master,PhD',
            'pdf'            => 'nullable|file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        $program = Program::findOrFail($data['program_id']);
        $slug   = strtolower($program->slug);
        $year   = $data['graduated_year'];
        $prefix = 'acm-' . $year . '-' . $slug . '-';

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
                'program_id'         => $data['program_id'],
                'certificate_number' => $certNumber,
                'issue_date'         => now()->toDateString(),
                'level'              => $data['level'],
                'status'             => 'active',
            ]);
        });

        // Store uploaded sample PDF if provided
        if ($request->hasFile('pdf')) {
            $programSlug = $program->slug;
            $dir = public_path('sample_certificates/' . $programSlug);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            $ext = $request->file('pdf')->getClientOriginalExtension();
            $request->file('pdf')->move($dir, $certNumber . '.' . $ext);
            Certificate::where('certificate_number', $certNumber)
                ->update(['certificate_sample' => 'sample_certificates/' . $programSlug . '/' . $certNumber . '.' . $ext]);
        }

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

    public function edit(Certificate $certificate)
    {
        $certificate->load(['program', 'studentProgram.verifiedStudent']);

        return Inertia::render('Admin/Certificates/Edit', [
            'certificate' => [
                'id'                 => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'program_id'         => $certificate->program_id,
                'assigned'           => $certificate->studentProgram !== null,
                'program_title'      => $certificate->program?->title ?? $certificate->studentProgram?->program?->title,
                'program_slug'       => $certificate->program_slug,
                'level'              => $certificate->level,
                'issue_date'         => $certificate->issue_date?->toDateString(),
                'status'             => $certificate->status,
                'certificate_sample' => $certificate->certificate_sample,
                'student'            => $certificate->student ? [
                    'student_id' => $certificate->student->student_id,
                    'full_name'  => $certificate->student->full_name,
                ] : null,
            ],
            'programs' => Program::where('is_active', true)
                ->orWhere('id', $certificate->program_id)
                ->orderBy('title')
                ->get(['id', 'slug', 'title', 'level']),
        ]);
    }

    public function update(Request $request, Certificate $certificate)
    {
        // Quick status change (Revoke / Reinstate buttons on the list page).
        if (! $request->hasAny(['program_id', 'level', 'issue_date', 'sample', 'remove_sample'])) {
            $request->validate(['status' => 'required|in:active,revoked']);
            $certificate->update(['status' => $request->status]);

            return back()->with('success', 'Certificate status updated.');
        }

        // Full edit. The certificate number is intentionally not editable: it is printed on the
        // certificate and used for verification, so it stays the same even if the programme changes.
        $data = $request->validate([
            'program_id'    => 'required|exists:programs,id',
            'level'         => 'required|in:Degree,Diploma,Certificate,Master,PhD',
            'issue_date'    => 'required|date',
            'status'        => 'required|in:active,revoked',
            'sample'        => 'nullable|file|mimes:jpg,jpeg,png,webp|max:20480',
            'remove_sample' => 'nullable|boolean',
        ]);

        if ((int) $data['program_id'] !== (int) $certificate->program_id && $certificate->studentProgram()->exists()) {
            throw ValidationException::withMessages([
                'program_id' => 'This certificate is assigned to a student enrolment, so its programme cannot be changed. Unassign it first.',
            ]);
        }

        $update = [
            'program_id' => $data['program_id'],
            'level'      => $data['level'],
            'issue_date' => $data['issue_date'],
            'status'     => $data['status'],
        ];

        $replacing = $request->hasFile('sample');

        if (($replacing || $request->boolean('remove_sample')) && $certificate->certificate_sample) {
            $old = public_path($certificate->certificate_sample);
            if (is_file($old)) {
                unlink($old);
            }
            $update['certificate_sample'] = null;
        }

        if ($replacing) {
            $slug = Program::find($data['program_id'])?->slug ?? 'unassigned';
            $dir  = public_path('sample_certificates/' . $slug);
            if (! is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            $file = $certificate->certificate_number . '.' . $request->file('sample')->getClientOriginalExtension();
            $request->file('sample')->move($dir, $file);
            $update['certificate_sample'] = 'sample_certificates/' . $slug . '/' . $file;
        }

        $certificate->update($update);

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate updated.');
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate deleted.');
    }
}
