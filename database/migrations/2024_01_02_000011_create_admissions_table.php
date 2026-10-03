<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->unsignedBigInteger('country_code_id');
            $table->string('phone');
            $table->unsignedBigInteger('nationality_id');
            $table->unsignedBigInteger('program_id');
            $table->text('education_history');
            $table->text('english_qualifications')->nullable();
            $table->boolean('declaration_accepted')->default(false);
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();

            $table->foreign('nationality_id')->references('id')->on('nationalities');
            $table->foreign('country_code_id')->references('id')->on('country_codes');
            $table->foreign('program_id')->references('id')->on('programs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};
