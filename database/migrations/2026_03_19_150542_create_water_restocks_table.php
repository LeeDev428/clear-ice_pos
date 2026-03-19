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
        Schema::create('water_restocks', function (Blueprint $table) {
            $table->id();
            $table->date('restock_date');
            $table->string('item_name')->default('Bottled Water');
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->default('case');
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['restock_date', 'item_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('water_restocks');
    }
};
