<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScholarshipApplication extends Model
{
    protected $appends = ['program_slug', 'program_title'];

    protected $fillable = [
        'full_name',
        'email',
        'program_id',
        'scheme',
        'annual_household_income',
        'motivation_statement',
        'referee1_name',
        'referee1_email',
        'referee2_name',
        'referee2_email',
        'status',
    ];

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
