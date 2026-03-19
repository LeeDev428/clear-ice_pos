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
        Schema::create('container_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sale_id')->nullable()->constrained()->nullOnDelete();
            $table->string('container_type');
            $table->unsignedInteger('quantity');
            $table->string('movement_type');
            $table->date('movement_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['customer_id', 'container_type', 'movement_type']);
            $table->index(['movement_date', 'container_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('container_movements');
    }
};
