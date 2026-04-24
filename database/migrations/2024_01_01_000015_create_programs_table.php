<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->enum('level', ['Degree', 'Diploma', 'Certificate']);
            $table->string('duration');
            $table->string('short');
            $table->text('overview');
            $table->json('modules')->nullable();
            $table->json('careers')->nullable();
            $table->json('entry')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('cover_photo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
