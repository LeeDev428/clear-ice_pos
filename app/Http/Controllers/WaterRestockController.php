<?php

namespace App\Http\Controllers;

use App\Models\WaterRestock;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WaterRestockController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'restock_date' => ['required', 'date'],
            'item_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'unit' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        WaterRestock::query()->create([
            'restock_date' => $validated['restock_date'],
            'item_name' => $validated['item_name'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'notes' => $validated['notes'] ?? null,
            'recorded_by' => $request->user()?->id,
        ]);

        return redirect()->route('dashboard')->with('success', 'Water restock saved successfully.');
    }
}
