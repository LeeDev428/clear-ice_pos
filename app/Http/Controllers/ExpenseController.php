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
            'transaction_type' => ['required', Rule::in(['regular', 'cash_advance', 'salary'])],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_source' => ['required', Rule::in(['cash', 'gcash'])],
        ]);

        $isCashAdvance = $validated['transaction_type'] === 'cash_advance';
        $isSalary = $validated['transaction_type'] === 'salary';

        Expense::query()->create([
            'expense_date' => $validated['expense_date'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'payment_source' => $validated['payment_source'],
            'is_cash_advance' => $isCashAdvance,
            'is_salary_payment' => $isSalary,
            'recorded_by' => $request->user()?->id,
        ]);

        return redirect()->route('dashboard')->with('success', 'Expense recorded successfully.');
    }
}
