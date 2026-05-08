<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verified_students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique();
            $table->string('nic', 20)->unique()->nullable();
            $table->string('passport', 20)->unique()->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->date('date_of_birth')->nullable();
            $table->unsignedBigInteger('nationality_id')->nullable();
            $table->string('gender', 10);
            $table->string('phone_country_code', 15)->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();

            
            $table->foreign('nationality_id')->references('id')->on('nationalities')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verified_students');
    }
};
