<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Employees: add rate fields + type
        Schema::table('employees', function (Blueprint $table) {
            $table->string('employee_type')->default('regular')->after('role'); // regular, probationary
            $table->decimal('daily_rate', 10, 2)->default(0)->after('employee_type');
            $table->decimal('ot_rate', 10, 2)->default(0)->after('daily_rate');
            $table->decimal('late_rate', 10, 2)->default(0)->after('ot_rate'); // deduction per 30-min block
            $table->decimal('sss_contribution', 10, 2)->default(0)->after('late_rate');
            $table->decimal('philhealth_contribution', 10, 2)->default(0)->after('sss_contribution');
            $table->decimal('pagibig_contribution', 10, 2)->default(0)->after('philhealth_contribution');
        });

        // Payroll entries: add shift type + bonus + late tracking
        Schema::table('payroll_entries', function (Blueprint $table) {
            $table->string('shift_type')->nullable()->after('shift_length'); // full_day, half_day
            $table->decimal('bonus', 10, 2)->default(0)->after('amount');
            $table->integer('late_minutes')->default(0)->after('bonus');
            $table->decimal('late_deduction', 10, 2)->default(0)->after('late_minutes');
        });

        // Sales: track last edit
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('last_edited_by')->nullable()->constrained('users')->nullOnDelete()->after('notes');
            $table->timestamp('last_edited_at')->nullable()->after('last_edited_by');
        });

        // Expenses: link to employee for cash advances / salary
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete()->after('recorded_by');
        });

        // Cash advances tracking
        Schema::create('cash_advances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('advance_date');
            $table->decimal('amount', 10, 2);
            $table->decimal('balance', 10, 2);
            $table->string('status')->default('active'); // active, paid
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['employee_id', 'status']);
            $table->index('advance_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_advances');

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['last_edited_by']);
            $table->dropColumn(['last_edited_by', 'last_edited_at']);
        });

        Schema::table('payroll_entries', function (Blueprint $table) {
            $table->dropColumn(['shift_type', 'bonus', 'late_minutes', 'late_deduction']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'employee_type', 'daily_rate', 'ot_rate', 'late_rate',
                'sss_contribution', 'philhealth_contribution', 'pagibig_contribution',
            ]);
        });
    }
};
