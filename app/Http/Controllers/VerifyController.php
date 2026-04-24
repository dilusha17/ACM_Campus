<?php

namespace App\Http\Controllers;

use App\Models\VerifiedStudent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifyController extends Controller
{
    public function index()
    {
        return Inertia::render('Verify', [
            'result'   => null,
            'searched' => false,
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string|max:50',
        ]);

        $id = strtoupper(trim($request->student_id));

        $student = VerifiedStudent::with(['studentPrograms' => fn ($q) => $q->with('certificate')->orderBy('enrollment_date')])
            ->where('student_id', $id)
            ->first();


        $result = null;
        if ($student) {
            $result = [
                'student_id' => $student->student_id,
                'full_name'  => $student->full_name,
                'image_path' => $student->image_path,
                'programs'   => $student->studentPrograms->map(fn ($sp) => [
                    'program_slug'    => $sp->program_slug,
                    'status'          => $sp->status,
                    'enrollment_date' => $sp->enrollment_date?->format('Y-m-d'),
                    'graduation_date' => $sp->graduation_date?->format('Y-m-d'),
                    'suspended_date'  => $sp->suspended_date?->format('Y-m-d'),
                    'certificate'     => $sp->certificate ? [
                        'certificate_number' => $sp->certificate->certificate_number,
                        'issue_date'         => $sp->certificate->issue_date->format('Y-m-d'),
                        'level'              => $sp->certificate->level,
                        'status'             => $sp->certificate->status,
                    ] : null,
                ])->values()->all(),
            ];
        }

        return Inertia::render('Verify', [
            'result'   => $result,
            'searched' => true,
            'query'    => $request->only(['student_id']),
        ]);
    }
}
