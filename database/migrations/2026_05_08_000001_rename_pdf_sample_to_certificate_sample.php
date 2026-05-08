<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('programs_certificates', 'pdf_sample')) {
            Schema::table('programs_certificates', function (Blueprint $table) {
                $table->renameColumn('pdf_sample', 'certificate_sample');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('programs_certificates', 'certificate_sample')) {
            Schema::table('programs_certificates', function (Blueprint $table) {
                $table->renameColumn('certificate_sample', 'pdf_sample');
            });
        }
    }
};
