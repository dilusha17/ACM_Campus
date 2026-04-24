<?php

namespace App\Http\Controllers;

use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactSubmittedMail;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $inquiry = ContactInquiry::create($data);

        Mail::to('info@acmcampus.uk')->send(new ContactSubmittedMail($inquiry));
        Mail::to($inquiry->email)->send(new ContactAutoReplyMail($inquiry));

        return back()->with('success', 'Your message has been sent. We will reply within 2–3 working days.');
    }
}
