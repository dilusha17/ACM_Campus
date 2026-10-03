<?php

namespace App\Http\Controllers;

use App\Mail\StudentDetailsSubmittedMail;
use App\Models\StudentDetailRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StudentDetailsController extends Controller
{
    public function show(string $token)
    {
        $detailRequest = StudentDetailRequest::with('program')->where('token', $token)->first();

        $state = match (true) {
            ! $detailRequest              => 'invalid',
            $detailRequest->isSubmitted() => 'submitted',
            $detailRequest->isExpired()   => 'expired',
            default                       => 'open',
        };

        return Inertia::render('StudentDetails', [
            'state'   => $state,
            'request' => $state === 'open' ? [
                'token'         => $detailRequest->token,
                'full_name'     => $detailRequest->full_name,
                'email'         => $detailRequest->email,
                'program_title' => $detailRequest->program?->title,
                'expires_at'    => $detailRequest->expires_at->toDateString(),
            ] : null,
        ]);
    }

    public function store(Request $request, string $token)
    {
        $detailRequest = StudentDetailRequest::where('token', $token)->firstOrFail();

        abort_if($detailRequest->isSubmitted() || $detailRequest->isExpired(), 410, 'This link is no longer valid.');

        $idUniqueRule = $request->input('id_type') === 'Passport'
            ? 'required|string|max:20|unique:verified_students,passport'
            : 'required|string|max:20|unique:verified_students,nic';

        $data = $request->validate([
            'id_type'         => 'required|in:NIC,Passport',
            'id_number'       => $idUniqueRule,
            'date_of_birth'   => 'required|date|before:today',
            'nationality_id'  => 'required|exists:nationalities,id',
            'gender'          => 'required|in:male,female,not_stated',
            'country_code_id' => 'required|exists:country_codes,id',
            'phone'           => ['required', 'string', 'max:30', 'regex:/^\d+$/'],
            'address'         => 'required|string|max:500',
            'image'           => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ], [
            'image.max' => 'The photo must be smaller than 5 MB.',
        ]);

        $image = $data['image'];
        unset($data['image']);

        $directory = public_path('student-submissions');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $fileName = Str::random(24) . '.' . $image->getClientOriginalExtension();
        $image->move($directory, $fileName);

        $detailRequest->update($data + [
            'image_path'   => 'student-submissions/' . $fileName,
            'submitted_at' => now(),
        ]);

        try {
            Mail::to('info@acmcampus.uk')->send(new StudentDetailsSubmittedMail($detailRequest->fresh(['program', 'scholarshipApplication'])));
        } catch (\Throwable $e) {
            report($e);
        }

        return redirect()->route('student-details.show', $token);
    }
}
