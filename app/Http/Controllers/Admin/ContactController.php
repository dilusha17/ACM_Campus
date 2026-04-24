<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ContactReplyMail;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactInquiry::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('subject', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Contacts/Index', [
            'inquiries' => $query->paginate(15)->withQueryString(),
            'filters'   => $request->only(['status', 'search']),
        ]);
    }

    public function show(ContactInquiry $inquiry)
    {
        if ($inquiry->status === 'new') {
            $inquiry->update(['status' => 'read']);
        }

        return Inertia::render('Admin/Contacts/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    public function reply(Request $request, ContactInquiry $inquiry)
    {
        $request->validate([
            'reply_message' => 'required|string|max:5000',
        ]);

        Mail::to($inquiry->email)->send(new ContactReplyMail($inquiry, $request->reply_message));

        $inquiry->update(['status' => 'replied']);

        return back()->with('success', 'Reply sent successfully.');
    }
}
