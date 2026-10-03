<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Program;

class Certificate extends Model
{
    protected $table = 'programs_certificates';

    protected $appends = ['program_slug', 'program_title'];

    protected $fillable = [
        'program_id',
        'certificate_number',
        'issue_date',
        'level',
        'status',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'metadata'   => 'array',
        ];
    }

    public function studentProgram()
    {
        return $this->hasOne(StudentProgram::class, 'certificate_id');
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

    /**
     * Convenience accessor — the verified student via studentProgram.
     */
    public function getStudentAttribute(): ?VerifiedStudent
    {
        return $this->studentProgram?->verifiedStudent;
    }
}
