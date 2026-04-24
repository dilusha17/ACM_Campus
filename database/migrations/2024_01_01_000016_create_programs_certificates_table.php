<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('program_slug');
            $table->string('certificate_number')->unique();
            $table->date('issue_date');
            $table->enum('level', ['Degree', 'Diploma', 'Certificate', 'Master', 'PhD']);
            $table->enum('status', ['active', 'revoked'])->default('active');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('program_slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs_certificates');
    }
};
