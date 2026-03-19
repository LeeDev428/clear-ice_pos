<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payroll_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->date('entry_date');
            $table->string('entry_type');
            $table->string('shift_length')->nullable();
            $table->time('expected_in')->nullable();
            $table->time('actual_in')->nullable();
            $table->time('actual_out')->nullable();
            $table->unsignedInteger('lunch_break_minutes')->default(0);
            $table->decimal('amount', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['entry_date', 'entry_type']);
            $table->index(['employee_id', 'entry_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_entries');
    }
};
