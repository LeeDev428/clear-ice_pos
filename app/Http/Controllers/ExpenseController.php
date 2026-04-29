<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'expense_date' => ['required', 'date'],
            'category' => ['required', Rule::in(['Auto Repair', 'Fuel', 'Utilities', 'Maintenance', 'Supplies', 'Others'])],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_source' => ['required', Rule::in(['cash', 'gcash'])],
        ]);

        Expense::query()->create([
            'expense_date' => $validated['expense_date'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'payment_source' => $validated['payment_source'],
            'is_cash_advance' => false,
            'is_salary_payment' => false,
            'recorded_by' => $request->user()?->id,
        ]);

        return redirect()->route('dashboard')->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        // Prevent editing auto-posted salary/cash-advance expenses
        if ($expense->is_salary_payment || $expense->is_cash_advance) {
            return back()->withErrors(['expense' => 'Auto-posted payroll expenses cannot be edited directly.']);
        }

        $validated = $request->validate([
            'category' => ['required', Rule::in(['Auto Repair', 'Fuel', 'Utilities', 'Maintenance', 'Supplies', 'Others'])],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_source' => ['required', Rule::in(['cash', 'gcash'])],
        ]);

        $expense->update($validated);

        return redirect()->route('dashboard')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        // Prevent deleting auto-posted payroll expenses
        if ($expense->is_salary_payment || $expense->is_cash_advance) {
            return back()->withErrors(['expense' => 'Auto-posted payroll expenses cannot be deleted directly.']);
        }

        $expense->delete();

        return redirect()->route('dashboard')->with('success', 'Expense deleted successfully.');
    }
}
