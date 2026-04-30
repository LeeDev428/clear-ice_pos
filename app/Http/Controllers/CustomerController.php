<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'phone'      => ['nullable', 'string', 'max:50'],
            'address'    => ['nullable', 'string', 'max:500'],
            'is_walk_in' => ['boolean'],
        ]);

        Customer::query()->create([
            'name'       => $validated['name'],
            'phone'      => $validated['phone'] ?? null,
            'address'    => $validated['address'] ?? null,
            'is_walk_in' => $validated['is_walk_in'] ?? false,
            'is_active'  => true,
        ]);

        return redirect()->route('dashboard')->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'phone'      => ['nullable', 'string', 'max:50'],
            'address'    => ['nullable', 'string', 'max:500'],
            'is_walk_in' => ['boolean'],
        ]);

        $customer->update([
            'name'       => $validated['name'],
            'phone'      => $validated['phone'] ?? null,
            'address'    => $validated['address'] ?? null,
            'is_walk_in' => $validated['is_walk_in'] ?? false,
        ]);

        return redirect()->route('dashboard')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->update(['is_active' => false]);

        return redirect()->route('dashboard')->with('success', 'Customer deactivated successfully.');
    }
}
