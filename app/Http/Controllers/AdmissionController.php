<?php

namespace App\Http\Controllers;

use App\Mail\AdmissionAutoReplyMail;
use App\Mail\AdmissionSubmittedMail;
use App\Models\Admission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdmissionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'            => 'required|string|max:255',
            'email'                => 'required|email|max:255',
            'phone'                => 'required|string|max:50',
            'nationality'          => 'required|string|max:100',
            'program_slug'         => 'required|string|max:255',
            'education_history'       => 'required|string|max:5000',
            'english_qualifications'   => 'nullable|string|max:1000',
            'declaration_accepted'     => 'required|accepted',
        ]);

        $data['declaration_accepted'] = true;

        $admission = Admission::create($data);

        Mail::to('info@acmcampus.uk')->send(new AdmissionSubmittedMail($admission));
        Mail::to($admission->email)->send(new AdmissionAutoReplyMail($admission));

        return back()->with('success', 'Your application has been submitted. You will hear from us within 10–15 working days.');
    }
}
