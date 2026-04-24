<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Sales: discount total + void audit fields
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('discount_amount', 10, 2)->default(0)->after('total_amount');
            $table->string('void_reason')->nullable()->after('voided_at');
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete()->after('void_reason');
        });

        // Sale items: per-line discount + container type override
        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('discount', 10, 2)->default(0)->after('subtotal');
            $table->string('container_type')->nullable()->after('discount');
        });

        // Payroll: deduction type for SSS/PhilHealth/Pag-ibig, overtime fields
        Schema::table('payroll_entries', function (Blueprint $table) {
            $table->string('deduction_type')->nullable()->after('entry_type');
            $table->boolean('ot_approved')->default(false)->after('lunch_break_minutes');
            $table->decimal('ot_hours', 5, 2)->default(0)->after('ot_approved');
            $table->decimal('ot_rate', 10, 2)->default(0)->after('ot_hours');
        });
    }

    public function down(): void
    {
        Schema::table('payroll_entries', function (Blueprint $table) {
            $table->dropColumn(['deduction_type', 'ot_approved', 'ot_hours', 'ot_rate']);
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropColumn(['discount', 'container_type']);
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['discount_amount', 'void_reason', 'voided_by']);
        });
    }
};
