<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        Customer::query()->firstOrCreate([
            'name' => 'Walk-in Customer',
        ], [
            'is_walk_in' => true,
            'is_active' => true,
        ]);

        $products = [
            ['name' => 'Tube Ice 28mm - 1 Sack', 'category' => 'ice', 'ice_size' => '28mm', 'container_type' => 'sack', 'price' => 250, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 28mm - 1/2 Sack', 'category' => 'ice', 'ice_size' => '28mm', 'container_type' => 'sack', 'price' => 125, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 28mm - Big Styro', 'category' => 'ice', 'ice_size' => '28mm', 'container_type' => 'big_styro', 'price' => 240, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 28mm - Small Styro', 'category' => 'ice', 'ice_size' => '28mm', 'container_type' => 'small_styro', 'price' => 190, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 28mm - Bag', 'category' => 'ice', 'ice_size' => '28mm', 'container_type' => 'bag', 'price' => 40, 'is_returnable' => false, 'track_inventory' => true],
            ['name' => 'Tube Ice 35mm - 1 Sack', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'sack', 'price' => 250, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 35mm - 1/2 Sack', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'sack', 'price' => 125, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 35mm - Big Styro', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'big_styro', 'price' => 240, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 35mm - Small Styro', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'small_styro', 'price' => 190, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Tube Ice 35mm - Bag', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'bag', 'price' => 40, 'is_returnable' => false, 'track_inventory' => true],
            ['name' => 'Crushed Ice - 1 Sack', 'category' => 'ice', 'ice_size' => '35mm', 'container_type' => 'sack', 'price' => 280, 'is_returnable' => true, 'track_inventory' => true],
            ['name' => 'Slim Gallon - 5 gal', 'category' => 'water', 'ice_size' => null, 'container_type' => 'gallon', 'price' => 35, 'is_returnable' => true, 'track_inventory' => false],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['name' => $product['name']],
                $product + ['is_active' => true]
            );
        }

        $employees = [
            ['name' => 'Juan Dela Cruz', 'role' => 'Delivery Staff'],
            ['name' => 'Maria Santos', 'role' => 'Cashier'],
            ['name' => 'Pedro Reyes', 'role' => 'Helper'],
        ];

        foreach ($employees as $employee) {
            Employee::query()->updateOrCreate(
                ['name' => $employee['name']],
                $employee + ['is_active' => true]
            );
        }
    }
}
