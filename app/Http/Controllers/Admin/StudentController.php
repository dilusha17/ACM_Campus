<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admission;
use App\Models\Certificate;
use App\Models\StudentProgram;
use App\Models\VerifiedStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = VerifiedStudent::with('studentPrograms')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->whereHas('studentPrograms', fn($q) => $q->where('status', $request->status));
        }

        return Inertia::render('Admin/Students/Index', [
            'students'    => $query->paginate(15)->withQueryString(),
            'filters'     => $request->only(['status', 'search']),
            'total_count' => VerifiedStudent::count(),
        ]);
    }

    public function create()
    {
        $year    = date('Y');
        $prefix  = 'ACM-' . $year . '-';
        $last    = VerifiedStudent::where('student_id', 'like', $prefix . '%')
            ->orderByDesc('student_id')
            ->value('student_id');
        $seq     = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;
        $nextId  = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

        $certs = Certificate::whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->orderBy('program_slug')
            ->orderBy('certificate_number')
            ->get(['id', 'certificate_number', 'program_slug']);

        return Inertia::render('Admin/Students/Create', [
            'admissions'             => Admission::where('status', 'accepted')
                ->whereDoesntHave('verifiedStudent')
                ->get(['id', 'full_name', 'email', 'program_slug']),
            'programs'               => \App\Models\Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'next_student_id'        => $nextId,
            'available_certificates' => $certs->groupBy('program_slug')->map(fn ($g) => $g->values()),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'          => 'required|string|max:255',
            'date_of_birth'      => 'required|date',
            'email'              => 'required|email|max:255',
            'nationality'        => 'required|string|max:100',
            'phone_country_code' => 'required|string|max:15',
            'phone'              => 'required|string|max:30',
            'address'            => 'nullable|string|max:500',
            'program_slug'       => 'required|string|max:255',
            'admission_id'       => 'nullable|exists:admissions,id',
            'enrollment_date'    => 'required|date',
            'graduation_date'    => 'nullable|date|required_if:status,graduated',
            'suspended_date'     => 'nullable|date|required_if:status,suspended',
            'status'             => 'required|in:active,graduated,suspended',
            'certificate_id'     => 'nullable|exists:programs_certificates,id',
            'image'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Auto-generate student ID
        $year   = date('Y');
        $prefix = 'ACM-' . $year . '-';
        $last   = VerifiedStudent::where('student_id', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('student_id')
            ->value('student_id');
        $seq      = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;
        $studentId = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $nameSlug  = Str::slug($data['full_name']);
            $filename  = $studentId . '_' . $nameSlug . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('students'), $filename);
            $imagePath = 'students/' . $filename;
        }

        DB::transaction(function () use ($data, $imagePath, $studentId) {
            $student = VerifiedStudent::create([
                'student_id'         => $studentId,
                'full_name'          => $data['full_name'],
                'date_of_birth'      => $data['date_of_birth'],
                'email'              => $data['email'],
                'nationality'        => $data['nationality'],
                'phone_country_code' => $data['phone_country_code'],
                'phone'              => $data['phone'],
                'address'            => $data['address'] ?? null,
                'admission_id'       => $data['admission_id'] ?? null,
                'image_path'         => $imagePath,
            ]);

            $sp = StudentProgram::create([
                'verified_student_id' => $student->id,
                'program_slug'        => $data['program_slug'],
                'admission_id'        => $data['admission_id'] ?? null,
                'enrollment_date'     => $data['enrollment_date'],
                'graduation_date'     => $data['graduation_date'] ?? null,
                'suspended_date'      => $data['suspended_date'] ?? null,
                'status'              => $data['status'],
            ]);

            // Assign certificate if provided
            if (!empty($data['certificate_id'])) {
                $sp->update(['certificate_id' => $data['certificate_id']]);
            }
        });

        return redirect()->route('admin.students.index')->with('success', 'Student added successfully.');
    }

    public function show(VerifiedStudent $student)
    {
        return Inertia::render('Admin/Students/Show', [
            'student' => $student->load(['admission', 'studentPrograms']),
        ]);
    }

    public function edit(VerifiedStudent $student)
    {
        $student->load(['studentPrograms.certificate', 'studentPrograms.program']);

        $slugs = $student->studentPrograms->pluck('program_slug')->unique()->values()->toArray();

        $availableCerts = Certificate::whereDoesntHave('studentProgram')
            ->whereIn('program_slug', $slugs)
            ->where('status', 'active')
            ->orderBy('certificate_number')
            ->get(['id', 'certificate_number', 'program_slug'])
            ->groupBy('program_slug')
            ->map(fn ($group) => $group->values());

        return Inertia::render('Admin/Students/Edit', [
            'student'                => $student,
            'admissions'             => Admission::where('status', 'accepted')->get(['id', 'full_name', 'email', 'program_slug']),
            'programs'               => \App\Models\Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'available_certificates' => $availableCerts,
        ]);
    }

    public function update(Request $request, VerifiedStudent $student)
    {
        $data = $request->validate([
            'student_id'         => ['required', 'string', 'max:50', 'regex:/^ACM-\d{4}-\d{5}$/', 'unique:verified_students,student_id,' . $student->id],
            'full_name'          => 'required|string|max:255',
            'date_of_birth'      => 'required|date',
            'email'              => 'required|email|max:255',
            'nationality'        => 'required|string|max:100',
            'phone_country_code' => 'required|string|max:15',
            'phone'              => 'required|string|max:30',
            'address'            => 'nullable|string|max:500',
            'image'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($student->image_path && file_exists(public_path($student->image_path))) {
                unlink(public_path($student->image_path));
            }
            $nameSlug  = Str::slug($data['full_name']);
            $filename  = $data['student_id'] . '_' . $nameSlug . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('students'), $filename);
            $data['image_path'] = 'students/' . $filename;
        }

        $student->update([
            'student_id'         => $data['student_id'],
            'full_name'          => $data['full_name'],
            'date_of_birth'      => $data['date_of_birth'],
            'email'              => $data['email'],
            'nationality'        => $data['nationality'],
            'phone_country_code' => $data['phone_country_code'],
            'phone'              => $data['phone'],
            'address'            => $data['address'] ?? null,
            'image_path'         => $data['image_path'] ?? $student->image_path,
        ]);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroy(VerifiedStudent $student)
    {
        if ($student->image_path && file_exists(public_path($student->image_path))) {
            unlink(public_path($student->image_path));
        }
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student removed.');
    }
}
