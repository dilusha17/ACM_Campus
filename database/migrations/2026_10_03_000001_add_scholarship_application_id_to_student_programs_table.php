<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_programs', function (Blueprint $table) {
            $table->unsignedBigInteger('scholarship_application_id')->nullable()->after('admission_id');
            $table->foreign('scholarship_application_id')->references('id')->on('scholarship_applications')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('student_programs', function (Blueprint $table) {
            $table->dropForeign(['scholarship_application_id']);
            $table->dropColumn('scholarship_application_id');
        });
    }
};
