<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:100'],
            'employee_type' => ['required', Rule::in(['regular', 'probationary'])],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'ot_rate' => ['nullable', 'numeric', 'min:0'],
            'late_rate' => ['nullable', 'numeric', 'min:0'],
            'sss_contribution' => ['nullable', 'numeric', 'min:0'],
            'philhealth_contribution' => ['nullable', 'numeric', 'min:0'],
            'pagibig_contribution' => ['nullable', 'numeric', 'min:0'],
        ]);

        Employee::query()->create([
            'name' => $validated['name'],
            'role' => $validated['role'] ?? null,
            'employee_type' => $validated['employee_type'],
            'daily_rate' => (float) $validated['daily_rate'],
            'ot_rate' => (float) ($validated['ot_rate'] ?? 0),
            'late_rate' => (float) ($validated['late_rate'] ?? 0),
            'sss_contribution' => (float) ($validated['sss_contribution'] ?? 0),
            'philhealth_contribution' => (float) ($validated['philhealth_contribution'] ?? 0),
            'pagibig_contribution' => (float) ($validated['pagibig_contribution'] ?? 0),
            'is_active' => true,
        ]);

        return redirect()->route('dashboard')->with('success', 'Employee added successfully.');
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:100'],
            'employee_type' => ['required', Rule::in(['regular', 'probationary'])],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'ot_rate' => ['nullable', 'numeric', 'min:0'],
            'late_rate' => ['nullable', 'numeric', 'min:0'],
            'sss_contribution' => ['nullable', 'numeric', 'min:0'],
            'philhealth_contribution' => ['nullable', 'numeric', 'min:0'],
            'pagibig_contribution' => ['nullable', 'numeric', 'min:0'],
        ]);

        $employee->update([
            'name' => $validated['name'],
            'role' => $validated['role'] ?? null,
            'employee_type' => $validated['employee_type'],
            'daily_rate' => (float) $validated['daily_rate'],
            'ot_rate' => (float) ($validated['ot_rate'] ?? 0),
            'late_rate' => (float) ($validated['late_rate'] ?? 0),
            'sss_contribution' => (float) ($validated['sss_contribution'] ?? 0),
            'philhealth_contribution' => (float) ($validated['philhealth_contribution'] ?? 0),
            'pagibig_contribution' => (float) ($validated['pagibig_contribution'] ?? 0),
        ]);

        return redirect()->route('dashboard')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->update(['is_active' => false]);

        return redirect()->route('dashboard')->with('success', 'Employee deactivated.');
    }
}
