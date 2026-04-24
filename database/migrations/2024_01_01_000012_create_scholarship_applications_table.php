<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('program_slug');
            $table->enum('scheme', ['Merit', 'Need-based', 'International', 'Research']);
            $table->string('annual_household_income');
            $table->text('motivation_statement');
            $table->string('referee1_name');
            $table->string('referee1_email');
            $table->string('referee2_name');
            $table->string('referee2_email');
            $table->enum('status', ['pending', 'reviewed', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholarship_applications');
    }
};
