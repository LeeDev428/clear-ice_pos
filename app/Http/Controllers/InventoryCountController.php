<?php

namespace App\Http\Controllers;

use App\Models\InventoryCount;
use App\Models\SaleItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InventoryCountController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'count_date' => ['required', 'date'],
            'ice_size' => ['required', Rule::in(['28mm', '35mm'])],
            'beginning_sacks' => ['required', 'numeric', 'min:0'],
            'harvested_today' => ['required', 'numeric', 'min:0'],
            'actual_ending_count' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $soldToday = (float) SaleItem::query()
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->whereDate('sales.sale_date', $validated['count_date'])
            ->where('sales.status', 'completed')
            ->where('products.track_inventory', true)
            ->where('products.ice_size', $validated['ice_size'])
            ->sum('sale_items.quantity');

        $expected = (float) $validated['beginning_sacks'] + (float) $validated['harvested_today'] - $soldToday;
        $variance = $expected - (float) $validated['actual_ending_count'];

        InventoryCount::query()->updateOrCreate(
            [
                'count_date' => $validated['count_date'],
                'ice_size' => $validated['ice_size'],
            ],
            [
                'beginning_sacks' => $validated['beginning_sacks'],
                'harvested_today' => $validated['harvested_today'],
                'sold_today' => $soldToday,
                'expected_count' => $expected,
                'actual_ending_count' => $validated['actual_ending_count'],
                'variance' => $variance,
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()?->id,
            ]
        );

        return redirect()->route('dashboard')->with('success', 'Inventory variance saved.');
    }
}
