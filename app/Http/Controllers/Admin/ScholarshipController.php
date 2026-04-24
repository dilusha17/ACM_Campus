<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ScholarshipStatusMail;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $query = ScholarshipApplication::latest();

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

    public function show(ScholarshipApplication $application)
    {
        return Inertia::render('Admin/Scholarships/Show', [
            'application' => $application,
        ]);
    }

    public function updateStatus(Request $request, ScholarshipApplication $application)
    {
        $request->validate(['status' => 'required|in:pending,reviewed,approved,rejected']);

        $oldStatus = $application->status;
        $newStatus = $request->status;

        $application->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            Mail::to($application->email)->send(new ScholarshipStatusMail($application, $newStatus));
        }

        return back()->with('success', 'Status updated and notification sent.');
    }
}
