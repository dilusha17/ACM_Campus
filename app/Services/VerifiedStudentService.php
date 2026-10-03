<?php

namespace App\Services;

use App\Mail\VerifiedStudentWelcomeMail;
use App\Models\Certificate;
use App\Models\Program;
use App\Models\StudentProgram;
use App\Models\VerifiedStudent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VerifiedStudentService
{
    public function nextStudentId(): string
    {
        return $this->buildNextStudentId(false);
    }

    public function create(array $data): VerifiedStudent
    {
        [$student, $studentProgram] = DB::transaction(function () use ($data) {
            $studentId = $this->buildNextStudentId(true);
            $program = Program::findOrFail($data['program_id']);
            $imagePath = $this->storeImage($data['image'] ?? null, $studentId, $data['full_name']);

            $student = VerifiedStudent::create([
                'student_id'         => $studentId,
                'nic'                => $data['id_type'] === 'NIC' ? $data['id_number'] : null,
                'passport'           => $data['id_type'] === 'Passport' ? $data['id_number'] : null,
                'first_name'         => $data['first_name'],
                'last_name'          => $data['last_name'],
                'full_name'          => $data['full_name'],
                'date_of_birth'      => $data['date_of_birth'],
                'email'              => $data['email'],
                'nationality_id'     => $data['nationality_id'],
                'gender'             => $data['gender'],
                'phone_country_code' => $data['phone_country_code'],
                'phone'              => $data['phone'],
                'address'            => $data['address'],
                'image_path'         => $imagePath,
            ]);

            $studentProgram = StudentProgram::create([
                'verified_student_id' => $student->id,
                'program_id'          => $program->id,
                'admission_id'        => !empty($data['admission_id']) ? (int) $data['admission_id'] : null,
                'enrollment_date'     => $data['enrollment_date'],
                'graduation_date'     => $data['graduation_date'] ?? null,
                'suspended_date'      => $data['suspended_date'] ?? null,
                'status'              => $data['status'],
            ]);

            if (!empty($data['certificate_id'])) {
                $certificate = Certificate::findOrFail($data['certificate_id']);

                if ((int) $certificate->program_id !== (int) $program->id) {
                    throw ValidationException::withMessages([
                        'certificate_id' => 'Certificate does not match the selected programme.',
                    ]);
                }

                if ($certificate->studentProgram()->exists()) {
                    throw ValidationException::withMessages([
                        'certificate_id' => 'This certificate is already assigned to another student.',
                    ]);
                }

                $studentProgram->update(['certificate_id' => $certificate->id]);
            }

            return [$student, $studentProgram];
        });

        $student->loadMissing('nationality');
        $studentProgram->loadMissing('program');

        try {
            Mail::to($student->email)->send(new VerifiedStudentWelcomeMail($student, $studentProgram));
        } catch (\Throwable $e) {
            report($e);
        }

        return $student->fresh(['nationality', 'studentPrograms.program']);
    }

    private function buildNextStudentId(bool $lock): string
    {
        $year = date('Y');
        $prefix = 'ACM-' . $year . '-';

        $query = VerifiedStudent::where('student_id', 'like', $prefix . '%');

        if ($lock) {
            $query->lockForUpdate();
        }

        $last = $query->orderByDesc('student_id')->value('student_id');
        $sequence = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;

        return $prefix . str_pad($sequence, 5, '0', STR_PAD_LEFT);
    }

    private function storeImage(?UploadedFile $image, string $studentId, string $fullName): ?string
    {
        if (!$image) {
            return null;
        }

        $directory = public_path('students');
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $fileName = $studentId . '_' . Str::slug($fullName) . '.' . $image->getClientOriginalExtension();
        $image->move($directory, $fileName);

        return 'students/' . $fileName;
    }
}