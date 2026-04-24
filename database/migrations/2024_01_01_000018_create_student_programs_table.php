<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_programs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('verified_student_id');
            $table->string('program_slug');
            $table->unsignedBigInteger('admission_id')->nullable();
            $table->foreign('admission_id')->references('id')->on('admissions')->nullOnDelete();
            $table->date('enrollment_date');
            $table->date('graduation_date')->nullable();
            $table->date('suspended_date')->nullable();
            $table->enum('status', ['active', 'graduated', 'suspended'])->default('active');
            $table->unsignedBigInteger('certificate_id')->nullable();
            $table->timestamps();

            $table->index('verified_student_id');

            $table->foreign('verified_student_id')->references('id')->on('verified_students')->cascadeOnDelete();
            $table->foreign('certificate_id')->references('id')->on('programs_certificates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_programs');
    }
};
