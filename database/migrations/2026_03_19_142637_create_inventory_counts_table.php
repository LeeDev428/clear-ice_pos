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
        Schema::create('inventory_counts', function (Blueprint $table) {
            $table->id();
            $table->date('count_date');
            $table->string('ice_size');
            $table->decimal('beginning_sacks', 10, 2)->default(0);
            $table->decimal('harvested_today', 10, 2)->default(0);
            $table->decimal('sold_today', 10, 2)->default(0);
            $table->decimal('expected_count', 10, 2)->default(0);
            $table->decimal('actual_ending_count', 10, 2)->default(0);
            $table->decimal('variance', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['count_date', 'ice_size']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_counts');
    }
};
