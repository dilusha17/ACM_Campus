<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_detail_requests', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->unsignedBigInteger('admission_id')->nullable();
            $table->unsignedBigInteger('scholarship_application_id')->nullable();
            $table->unsignedBigInteger('program_id');
            $table->string('full_name');
            $table->string('email');
            $table->timestamp('expires_at');
            $table->timestamp('submitted_at')->nullable();

            // Collected from the applicant
            $table->string('id_type', 10)->nullable();
            $table->string('id_number', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->unsignedBigInteger('nationality_id')->nullable();
            $table->string('gender', 10)->nullable();
            $table->unsignedBigInteger('country_code_id')->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('image_path')->nullable();

            // Set once an admin turns the submission into a verified student
            $table->unsignedBigInteger('verified_student_id')->nullable();
            $table->timestamps();

            $table->foreign('admission_id')->references('id')->on('admissions')->cascadeOnDelete();
            $table->foreign('scholarship_application_id')->references('id')->on('scholarship_applications')->cascadeOnDelete();
            $table->foreign('program_id')->references('id')->on('programs')->cascadeOnDelete();
            $table->foreign('nationality_id')->references('id')->on('nationalities')->nullOnDelete();
            $table->foreign('country_code_id')->references('id')->on('country_codes')->nullOnDelete();
            $table->foreign('verified_student_id')->references('id')->on('verified_students')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_detail_requests');
    }
};
