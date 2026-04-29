<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CashAdvanceController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'advance_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($validated, $request): void {
            $advance = CashAdvance::query()->create([
                'employee_id' => $validated['employee_id'],
                'advance_date' => $validated['advance_date'],
                'amount' => $validated['amount'],
                'balance' => $validated['amount'],
                'status' => 'active',
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]);

            // Auto-post to expenses
            Expense::query()->create([
                'expense_date' => $validated['advance_date'],
                'category' => 'Cash Advance',
                'description' => 'Cash advance — ' . ($advance->employee->name ?? 'Employee #' . $advance->employee_id),
                'amount' => $validated['amount'],
                'payment_source' => 'cash',
                'is_cash_advance' => true,
                'is_salary_payment' => false,
                'employee_id' => $validated['employee_id'],
                'recorded_by' => $request->user()?->id,
            ]);
        });

        return redirect()->route('dashboard')->with('success', 'Cash advance recorded successfully.');
    }
}
