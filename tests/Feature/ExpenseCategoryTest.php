<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExpenseCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_custom_expense_categories_are_shared_with_the_dashboard_and_accepted_when_editing(): void
    {
        $user = User::factory()->create();
        $category = ExpenseCategory::query()->create(['name' => 'Delivery Fee']);
        $expense = Expense::query()->create([
            'expense_date' => '2026-08-02',
            'category' => 'Auto Repair',
            'description' => 'Truck repair',
            'amount' => 500,
            'payment_source' => 'cash',
            'recorded_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where(
                    'expenseCategories',
                    fn ($categories) => collect($categories)
                        ->contains(fn ($item) => $item['id'] === $category->id && $item['name'] === 'Delivery Fee')
                ));

        $this->actingAs($user)
            ->patch(route('expenses.update', $expense), [
                'category' => 'Delivery Fee',
                'description' => 'Truck repair and delivery',
                'amount' => 650,
                'payment_source' => 'gcash',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'category' => 'Delivery Fee',
            'description' => 'Truck repair and delivery',
            'amount' => 650,
            'payment_source' => 'gcash',
        ]);
    }
}
