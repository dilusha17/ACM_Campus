<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'nationality',
        'program_slug',
        'education_history',
        'english_qualifications',
        'declaration_accepted',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'declaration_accepted' => 'boolean',
        ];
    }

    public function verifiedStudent()
    {
        return $this->hasOne(VerifiedStudent::class);
    }

    public function studentPrograms()
    {
        return $this->hasMany(StudentProgram::class);
    }
}
