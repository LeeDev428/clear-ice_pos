<?php

namespace App\Http\Controllers;

use App\Models\ContainerMovement;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RecordController extends Controller
{
    public function returnContainer(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'container_type' => ['required', Rule::in(['gallon', 'big_styro', 'small_styro', 'sack'])],
            'quantity' => ['required', 'integer', 'min:1'],
            'movement_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        ContainerMovement::query()->create([
            'customer_id' => $validated['customer_id'],
            'sale_id' => null,
            'container_type' => $validated['container_type'],
            'quantity' => $validated['quantity'],
            'movement_type' => 'return',
            'movement_date' => $validated['movement_date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('dashboard')->with('success', 'Container return logged successfully.');
    }

    public function history(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
        ]);

        $history = Sale::query()
            ->with(['customer:id,name', 'items.product:id,name'])
            ->whereDate('sale_date', $validated['date'])
            ->latest('id')
            ->get();

        return response()->json([
            'data' => $history,
        ]);
    }
}
