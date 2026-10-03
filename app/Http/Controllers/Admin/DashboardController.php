<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admission;
use App\Models\ContactInquiry;
use App\Models\ScholarshipApplication;
use App\Models\VerifiedStudent;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pendingAdmissions'   => Admission::where('status', 'pending')->count(),
                'pendingScholarships' => ScholarshipApplication::where('status', 'pending')->count(),
                'newContacts'         => ContactInquiry::where('status', 'new')->count(),
                'totalStudents'       => VerifiedStudent::count(),
                'totalAdmissions'     => Admission::count(),
                'totalScholarships'   => ScholarshipApplication::count(),
            ],
            'recentAdmissions'   => Admission::with('program')->latest()->take(5)->get(['id', 'full_name', 'email', 'program_id', 'status', 'created_at']),
            'recentScholarships' => ScholarshipApplication::with('program')->latest()->take(5)->get(['id', 'full_name', 'email', 'program_id', 'scheme', 'status', 'created_at']),
            'recentContacts'     => ContactInquiry::latest()->take(5)->get(['id', 'name', 'email', 'subject', 'status', 'created_at']),
        ]);
    }
}
