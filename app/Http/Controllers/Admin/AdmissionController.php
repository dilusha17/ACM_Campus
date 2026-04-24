<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AdmissionStatusMail;
use App\Models\Admission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Admission::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Admissions/Index', [
            'admissions' => $query->paginate(15)->withQueryString(),
            'filters'    => $request->only(['status', 'search']),
        ]);
    }

    public function show(Admission $admission)
    {
        return Inertia::render('Admin/Admissions/Show', [
            'admission' => $admission,
        ]);
    }

    public function updateStatus(Request $request, Admission $admission)
    {
        $request->validate(['status' => 'required|in:pending,reviewed,accepted,rejected']);

        $oldStatus = $admission->status;
        $newStatus = $request->status;

        $admission->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            Mail::to($admission->email)->send(new AdmissionStatusMail($admission, $newStatus));
        }

        return back()->with('success', 'Status updated and notification sent.');
    }
}
