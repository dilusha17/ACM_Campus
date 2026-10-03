<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    protected $appends = ['program_slug', 'program_title'];

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'country_code_id',
        'nationality_id',
        'program_id',
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

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }

    public function countryCode()
    {
        return $this->belongsTo(CountryCode::class);
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
