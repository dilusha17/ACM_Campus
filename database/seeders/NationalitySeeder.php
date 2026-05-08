<?php

namespace Database\Seeders;

use App\Models\Nationality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NationalitySeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $nationalities = [
            'Sri Lankan',
            'British',
        ];

        foreach ($nationalities as $name) {
            Nationality::firstOrCreate(['name' => $name]);
        }
    }
}
