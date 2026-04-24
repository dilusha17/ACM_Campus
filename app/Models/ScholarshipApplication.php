<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScholarshipApplication extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'program_slug',
        'scheme',
        'annual_household_income',
        'motivation_statement',
        'referee1_name',
        'referee1_email',
        'referee2_name',
        'referee2_email',
        'status',
    ];
}
