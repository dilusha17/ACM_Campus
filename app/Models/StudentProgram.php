<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class StudentProgram extends Model
{
    protected $appends = ['program_slug', 'program_title'];

    protected $fillable = [
        'verified_student_id',
        'program_id',
        'admission_id',
        'enrollment_date',
        'graduation_date',
        'suspended_date',
        'status',
        'certificate_id',
    ];

    protected function casts(): array
    {
        return [
            'enrollment_date' => 'date',
            'graduation_date' => 'date',
            'suspended_date'  => 'date',
        ];
    }

    public function verifiedStudent()
    {
        return $this->belongsTo(VerifiedStudent::class);
    }

    public function admission()
    {
        return $this->belongsTo(Admission::class);
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function getProgramSlugAttribute(): ?string
    {
        return $this->program?->slug;
    }

    public function getProgramTitleAttribute(): ?string
    {
        return $this->program?->title;
    }
}
