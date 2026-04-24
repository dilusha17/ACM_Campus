<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'admin@acmcampus.uk'],
            [
                'name'     => 'ACM Admin',
                'password' => bcrypt('Nobal@321'),
            ]
        );
    }
}
