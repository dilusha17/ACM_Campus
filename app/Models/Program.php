<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'level',
        'duration',
        'short',
        'overview',
        'modules',
        'careers',
        'entry',
        'is_active',
        'cover_photo',
    ];

    protected function casts(): array
    {
        return [
            'modules'   => 'array',
            'careers'   => 'array',
            'entry'     => 'array',
            'is_active' => 'boolean',
        ];
    }
}
