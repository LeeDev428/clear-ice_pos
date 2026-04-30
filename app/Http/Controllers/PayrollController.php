<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\Employee;
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
            'shift_type' => ['nullable', Rule::in(['full_day', 'half_day'])],
            'expected_in' => ['nullable', 'date_format:H:i'],
            'actual_in' => ['nullable', 'date_format:H:i'],
            'actual_out' => ['nullable', 'date_format:H:i'],
            'lunch_break_minutes' => ['nullable', 'integer', 'min:0'],
            'ot_hours' => ['nullable', 'numeric', 'min:0'],
            'ot_rate' => ['nullable', 'numeric', 'min:0'],
            'ot_approved' => ['nullable', 'boolean'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'bonus' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Compute late penalty for time_log entries
        $lateMinutes = 0;
        $lateDeduction = 0.0;

        if (
            $validated['entry_type'] === 'time_log'
            && ! empty($validated['expected_in'])
            && ! empty($validated['actual_in'])
            && ! empty($validated['employee_id'])
        ) {
            $expected = strtotime('2000-01-01 ' . $validated['expected_in']);
            $actual = strtotime('2000-01-01 ' . $validated['actual_in']);
            $diffMinutes = (int) max(0, ($actual - $expected) / 60);

            if ($diffMinutes > 0) {
                $lateMinutes = $diffMinutes;
                $units = (int) ceil($diffMinutes / 30);
                $employee = Employee::find($validated['employee_id']);
                $ratePerUnit = (float) ($employee->late_rate ?? 0);
                if ($ratePerUnit == 0.0) {
                    // Fallback: derive from daily rate — one 30-min late unit = daily_rate / 16
                    $ratePerUnit = (float) ($employee->daily_rate ?? 0) / 16;
                }
                $lateDeduction = $units * $ratePerUnit;
            }
        }

        DB::transaction(function () use ($validated, $lateMinutes, $lateDeduction, $request): void {
            PayrollEntry::query()->create([
                'employee_id' => $validated['employee_id'] ?? null,
                'entry_date' => $validated['entry_date'],
                'entry_type' => $validated['entry_type'],
                'deduction_type' => $validated['deduction_type'] ?? null,
                'shift_length' => $validated['shift_length'] ?? null,
                'shift_type' => $validated['shift_type'] ?? null,
                'expected_in' => $validated['expected_in'] ?? null,
                'actual_in' => $validated['actual_in'] ?? null,
                'actual_out' => $validated['actual_out'] ?? null,
                'lunch_break_minutes' => (int) ($validated['lunch_break_minutes'] ?? 0),
                'ot_hours' => (float) ($validated['ot_hours'] ?? 0),
                'ot_rate' => (float) ($validated['ot_rate'] ?? 0),
                'ot_approved' => (bool) ($validated['ot_approved'] ?? false),
                'amount' => (float) ($validated['amount'] ?? 0),
                'bonus' => (float) ($validated['bonus'] ?? 0),
                'late_minutes' => $lateMinutes,
                'late_deduction' => $lateDeduction,
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]);
        });

        return redirect()->route('dashboard')->with('success', 'Payroll entry saved successfully.');
    }

    /**
     * Finalize payroll: post net pay as salary expense + settle cash advances.
     */
    public function finalize(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'payment_date' => ['required', 'date'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'gte:start_date'],
            'net_pay' => ['required', 'numeric', 'min:0'],
            'ca_deducted' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($validated, $request): void {
            $employee = Employee::findOrFail($validated['employee_id']);

            Expense::query()->create([
                'expense_date' => $validated['payment_date'],
                'category' => 'Salary',
                'description' => 'Payroll — ' . $employee->name . ' (' . $validated['start_date'] . ' to ' . $validated['end_date'] . ')',
                'amount' => $validated['net_pay'],
                'payment_source' => 'cash',
                'is_cash_advance' => false,
                'is_salary_payment' => true,
                'employee_id' => $validated['employee_id'],
                'recorded_by' => $request->user()?->id,
            ]);

            // Settle cash advances oldest-first
            $caDeducted = (float) ($validated['ca_deducted'] ?? 0);
            if ($caDeducted > 0) {
                $advances = CashAdvance::query()
                    ->where('employee_id', $validated['employee_id'])
                    ->where('status', 'active')
                    ->where('balance', '>', 0)
                    ->orderBy('advance_date')
                    ->get();

                $remaining = $caDeducted;
                foreach ($advances as $advance) {
                    if ($remaining <= 0) {
                        break;
                    }
                    $deduct = min((float) $advance->balance, $remaining);
                    $newBalance = (float) $advance->balance - $deduct;
                    $advance->update([
                        'balance' => $newBalance,
                        'status' => $newBalance <= 0 ? 'paid' : 'active',
                    ]);
                    $remaining -= $deduct;
                }
            }
        });

        return redirect()->route('dashboard')->with('success', 'Payroll finalized. Salary posted to expenses.');
    }
}
