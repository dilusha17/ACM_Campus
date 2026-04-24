<?php

namespace App\Http\Controllers;

use App\Mail\ScholarshipAutoReplyMail;
use App\Mail\ScholarshipSubmittedMail;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ScholarshipController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'                => 'required|string|max:255',
            'email'                    => 'required|email|max:255',
            'program_slug'             => 'required|string|max:255',
            'scheme'                   => 'required|in:Merit,Need-based,International,Research',
            'annual_household_income'  => 'required|string|max:100',
            'motivation_statement'     => 'required|string|max:8000',
            'referee1_name'            => 'required|string|max:255',
            'referee1_email'           => 'required|email|max:255',
            'referee2_name'            => 'required|string|max:255',
            'referee2_email'           => 'required|email|max:255',
        ]);

        $application = ScholarshipApplication::create($data);

        Mail::to('info@acmcampus.uk')->send(new ScholarshipSubmittedMail($application));
        Mail::to($application->email)->send(new ScholarshipAutoReplyMail($application));

        return back()->with('success', 'Your scholarship application has been submitted. Our committee will review it and contact you within 4–6 weeks.');
    }
}
