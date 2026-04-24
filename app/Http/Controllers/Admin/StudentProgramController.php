<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\StudentProgram;
use App\Models\VerifiedStudent;
use Illuminate\Http\Request;

class StudentProgramController extends Controller
{
    public function store(Request $request, VerifiedStudent $student)
    {
        $data = $request->validate([
            'program_slug'    => [
                'required', 'string', 'max:255',
                function ($attribute, $value, $fail) use ($student) {
                    if ($student->studentPrograms()->where('program_slug', $value)->exists()) {
                        $fail('This student is already enrolled in that programme.');
                    }
                },
            ],
            'admission_id'    => 'nullable|exists:admissions,id',
            'enrollment_date' => 'required|date',
            'graduation_date' => 'nullable|date|required_if:status,graduated',
            'suspended_date'  => 'nullable|date|required_if:status,suspended',
            'status'          => 'required|in:active,graduated,suspended',
            'certificate_id'  => 'nullable|exists:programs_certificates,id',
        ]);

        $certificateId = $data['certificate_id'] ?? null;
        unset($data['certificate_id']);

        $sp = $student->studentPrograms()->create($data);

        if ($certificateId) {
            $cert = Certificate::findOrFail($certificateId);

            if ($cert->program_slug !== $sp->program_slug) {
                return back()->withErrors(['certificate_id' => 'Certificate does not match this programme.']);
            }

            if ($cert->studentProgram()->exists()) {
                return back()->withErrors(['certificate_id' => 'This certificate is already assigned to another student.']);
            }

            $sp->update(['certificate_id' => $cert->id]);
        }

        return back()->with('success', 'Programme enrollment added.');
    }

    public function update(Request $request, VerifiedStudent $student, StudentProgram $sp)
    {
        $data = $request->validate([
            'program_slug'    => [
                'required', 'string', 'max:255',
                function ($attribute, $value, $fail) use ($student, $sp) {
                    if ($student->studentPrograms()
                        ->where('program_slug', $value)
                        ->where('id', '!=', $sp->id)
                        ->exists()
                    ) {
                        $fail('This student is already enrolled in that programme.');
                    }
                },
            ],
            'admission_id'    => 'nullable|exists:admissions,id',
            'enrollment_date' => 'required|date',
            'graduation_date' => 'nullable|date|required_if:status,graduated',
            'suspended_date'  => 'nullable|date|required_if:status,suspended',
            'status'          => 'required|in:active,graduated,suspended',
            'certificate_id'  => 'nullable|exists:programs_certificates,id',
        ]);

        $certificateId = $data['certificate_id'] ?? null;
        unset($data['certificate_id']);

        $sp->update($data);

        if ($certificateId && $sp->certificate_id !== (int) $certificateId) {
            $cert = Certificate::findOrFail($certificateId);

            if ($cert->program_slug !== $sp->program_slug) {
                return back()->withErrors(['certificate_id' => 'Certificate does not match this programme.']);
            }

            // Ensure not already assigned to a different enrollment
            $existing = $cert->studentProgram()->first();
            if ($existing && $existing->id !== $sp->id) {
                return back()->withErrors(['certificate_id' => 'This certificate is already assigned to another student.']);
            }

            $sp->update(['certificate_id' => $cert->id]);
        } elseif (!$certificateId && $sp->certificate_id !== null) {
            $sp->update(['certificate_id' => null]);
        }

        return back()->with('success', 'Programme enrollment updated.');
    }

    public function destroy(VerifiedStudent $student, StudentProgram $sp)
    {
        if ($sp->certificate_id !== null) {
            return back()->withErrors([
                'sp' => 'Cannot remove a programme that has an issued certificate. Revoke and delete the certificate first.',
            ]);
        }

        $sp->delete();

        return back()->with('success', 'Programme enrollment removed.');
    }

    public function assignCertificate(Request $request, VerifiedStudent $student, StudentProgram $sp)
    {
        $request->validate([
            'certificate_id' => 'required|exists:programs_certificates,id',
        ]);

        if ($sp->status !== 'graduated') {
            return back()->withErrors(['sp' => 'Certificate can only be assigned to graduated students.']);
        }

        if ($sp->certificate_id !== null) {
            return back()->withErrors(['sp' => 'This programme enrollment already has a certificate.']);
        }

        $cert = Certificate::findOrFail($request->certificate_id);

        if ($cert->program_slug !== $sp->program_slug) {
            return back()->withErrors(['certificate' => 'Certificate does not match this programme.']);
        }

        if ($cert->studentProgram()->exists()) {
            return back()->withErrors(['certificate' => 'This certificate is already assigned to another student.']);
        }

        $sp->update(['certificate_id' => $cert->id]);

        return back()->with('success', 'Certificate assigned successfully.');
    }
}
