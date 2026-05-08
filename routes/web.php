<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\VerifyController;
use App\Http\Controllers\Admin;
use App\Models\Program;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', fn() => Inertia::render('Index'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/programs', fn() => Inertia::render('Programs', [
    'programs' => Program::where('is_active', true)
        ->orderBy('level')
        ->orderBy('title')
        ->get()
        ->map(fn (Program $program) => [
            'slug'     => $program->slug,
            'title'    => $program->title,
            'level'    => $program->level,
            'duration' => $program->duration,
            'short'    => $program->short,
            'overview' => $program->overview,
            'image'    => $program->cover_photo ? '/' . ltrim($program->cover_photo, '/') : null,
            'modules'  => $program->modules ?? [],
            'careers'  => $program->careers ?? [],
            'entry'    => $program->entry ?? [],
        ])
        ->values(),
]))->name('programs');
Route::get('/programs/{program:slug}', fn(Program $program) => Inertia::render('ProgramDetail', [
    'program' => [
        'slug'     => $program->slug,
        'title'    => $program->title,
        'level'    => $program->level,
        'duration' => $program->duration,
        'short'    => $program->short,
        'overview' => $program->overview,
        'image'    => $program->cover_photo ? '/' . ltrim($program->cover_photo, '/') : null,
        'modules'  => $program->modules ?? [],
        'careers'  => $program->careers ?? [],
        'entry'    => $program->entry ?? [],
    ],
]))->name('programs.detail');
Route::get('/admissions', fn() => Inertia::render('Admissions'))->name('admissions');
Route::get('/scholarships', fn() => Inertia::render('Scholarships'))->name('scholarships');
Route::get('/contact', fn() => Inertia::render('Contact'))->name('contact');
Route::get('/verify', [VerifyController::class, 'index'])->name('verify');
Route::post('/verify', [VerifyController::class, 'search'])->name('verify.search');

// Public form submissions
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/admissions', [AdmissionController::class, 'store'])->name('admissions.store');
Route::post('/scholarships', [ScholarshipController::class, 'store'])->name('scholarships.store');

// Admin authentication
Route::get('/admin/login', [Admin\AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [Admin\AuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [Admin\AuthController::class, 'logout'])->name('admin.logout');

// Admin panel (protected)
Route::prefix('admin')->middleware('admin.auth')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/admissions', [Admin\AdmissionController::class, 'index'])->name('admissions.index');
    Route::get('/admissions/{admission}', [Admin\AdmissionController::class, 'show'])->name('admissions.show');
    Route::patch('/admissions/{admission}/status', [Admin\AdmissionController::class, 'updateStatus'])->name('admissions.status');

    Route::get('/scholarships', [Admin\ScholarshipController::class, 'index'])->name('scholarships.index');
    Route::get('/scholarships/{application}', [Admin\ScholarshipController::class, 'show'])->name('scholarships.show');
    Route::patch('/scholarships/{application}/status', [Admin\ScholarshipController::class, 'updateStatus'])->name('scholarships.status');

    Route::get('/contacts', [Admin\ContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/{inquiry}', [Admin\ContactController::class, 'show'])->name('contacts.show');
    Route::post('/contacts/{inquiry}/reply', [Admin\ContactController::class, 'reply'])->name('contacts.reply');

    Route::resource('programs', Admin\ProgramController::class)->names('programs');
    Route::get('/certificates/generate-number', [Admin\CertificateController::class, 'generateNumber'])->name('certificates.generate-number');
    Route::get('/certificates/available', [Admin\CertificateController::class, 'available'])->name('certificates.available');
    Route::resource('certificates', Admin\CertificateController::class)->names('certificates');

    // Student import/export (must be before resource to avoid route-model binding conflict)
    Route::get('/students/export', [Admin\StudentController::class, 'export'])->name('students.export');
    Route::post('/students/import/check', [Admin\StudentController::class, 'importCheck'])->name('students.import.check');
    Route::post('/students/import', [Admin\StudentController::class, 'importConfirm'])->name('students.import');

    Route::resource('students', Admin\StudentController::class)->names('students');

    // Nested student programme enrollment routes
    Route::prefix('students/{student}')->name('students.')->group(function () {
        Route::post('/programs', [Admin\StudentProgramController::class, 'store'])->name('programs.store');
        Route::patch('/programs/{sp}', [Admin\StudentProgramController::class, 'update'])->name('programs.update');
        Route::delete('/programs/{sp}', [Admin\StudentProgramController::class, 'destroy'])->name('programs.destroy');
        Route::patch('/programs/{sp}/certificate', [Admin\StudentProgramController::class, 'assignCertificate'])->name('programs.certificate');
    });
});
