<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->timestamps();
        });

        // Seed with the existing hardcoded categories
        DB::table('expense_categories')->insert([
            ['name' => 'Auto Repair', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fuel',        'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Utilities',   'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Maintenance', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Supplies',    'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Others',      'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
