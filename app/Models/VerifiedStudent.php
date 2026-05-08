<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerifiedStudent extends Model
{
    protected $fillable = [
        'student_id',
        'nic',
        'passport',
        'first_name',
        'last_name',
        'full_name',
        'date_of_birth',
        'email',
        'gender',
        'nationality_id',
        'nationality',
        'phone_country_code',
        'phone',
        'address',
        'image_path',
    ];

    public function admission()
    {
        return $this->belongsTo(Admission::class);
    }

    public function nationality()
    {
        return $this->belongsTo(\App\Models\Nationality::class);
    }

    public function studentPrograms()
    {
        return $this->hasMany(StudentProgram::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset($this->image_path) : null;
    }
}
