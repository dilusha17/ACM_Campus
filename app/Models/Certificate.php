<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Program;

class Certificate extends Model
{
    protected $table = 'programs_certificates';

    protected $fillable = [
        'program_slug',
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
        return $this->belongsTo(Program::class, 'program_slug', 'slug');
    }

    /**
     * Convenience accessor — the verified student via studentProgram.
     */
    public function getStudentAttribute(): ?VerifiedStudent
    {
        return $this->studentProgram?->verifiedStudent;
    }
}
