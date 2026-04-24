<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\PayrollEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PayrollController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'entry_date' => ['required', 'date'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'entry_type' => ['required', Rule::in(['time_log', 'cash_advance', 'salary_payment', 'deduction', 'overtime'])],
            'deduction_type' => ['nullable', Rule::in(['sss', 'philhealth', 'pagibig', 'cash_advance'])],
            'shift_length' => ['nullable', 'string', 'max:100'],
            'expected_in' => ['nullable', 'date_format:H:i'],
            'actual_in' => ['nullable', 'date_format:H:i'],
            'actual_out' => ['nullable', 'date_format:H:i'],
            'lunch_break_minutes' => ['nullable', 'integer', 'min:0'],
            'ot_hours' => ['nullable', 'numeric', 'min:0'],
            'ot_rate' => ['nullable', 'numeric', 'min:0'],
            'ot_approved' => ['nullable', 'boolean'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($validated, $request): void {
            $payrollEntry = PayrollEntry::query()->create([
                'employee_id' => $validated['employee_id'] ?? null,
                'entry_date' => $validated['entry_date'],
                'entry_type' => $validated['entry_type'],
                'deduction_type' => $validated['deduction_type'] ?? null,
                'shift_length' => $validated['shift_length'] ?? null,
                'expected_in' => $validated['expected_in'] ?? null,
                'actual_in' => $validated['actual_in'] ?? null,
                'actual_out' => $validated['actual_out'] ?? null,
                'lunch_break_minutes' => (int) ($validated['lunch_break_minutes'] ?? 0),
                'ot_hours' => (float) ($validated['ot_hours'] ?? 0),
                'ot_rate' => (float) ($validated['ot_rate'] ?? 0),
                'ot_approved' => (bool) ($validated['ot_approved'] ?? false),
                'amount' => (float) ($validated['amount'] ?? 0),
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]);

            if ($validated['entry_type'] === 'cash_advance' || $validated['entry_type'] === 'salary_payment') {
                $amount = (float) ($validated['amount'] ?? 0);

                if ($amount > 0) {
                    $category = $validated['entry_type'] === 'cash_advance' ? 'Cash Advance' : 'Salary';

                    Expense::query()->create([
                        'expense_date' => $validated['entry_date'],
                        'category' => $category,
                        'description' => $validated['notes'] ?? ('Auto-posted from payroll entry #'.$payrollEntry->id),
                        'amount' => $amount,
                        'payment_source' => 'cash',
                        'is_cash_advance' => $validated['entry_type'] === 'cash_advance',
                        'is_salary_payment' => $validated['entry_type'] === 'salary_payment',
                        'recorded_by' => $request->user()?->id,
                    ]);
                }
            }
        });

        return redirect()->route('dashboard')->with('success', 'Payroll entry saved successfully.');
    }
}
