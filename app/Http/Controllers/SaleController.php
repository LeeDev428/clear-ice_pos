<?php

namespace App\Http\Controllers;

use App\Models\ContainerMovement;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SaleController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sale_date' => ['required', 'date'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'delivered_by' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', Rule::in(['cash', 'gcash', 'credit', 'partial'])],
            'cash_amount' => ['nullable', 'numeric', 'min:0'],
            'gcash_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.container_borrowed_qty' => ['nullable', 'integer', 'min:0'],
        ]);

        $productIds = collect($validated['items'])->pluck('product_id')->unique()->values();
        $products = Product::query()
            ->whereIn('id', $productIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        if ($products->count() !== $productIds->count()) {
            return back()->withErrors(['items' => 'One or more selected products are not active.'])->withInput();
        }

        $lineItems = [];
        $total = 0.0;

        foreach ($validated['items'] as $item) {
            $product = $products[(int) $item['product_id']];
            $quantity = (float) $item['quantity'];
            $unitPrice = (float) $product->price;
            $subtotal = $quantity * $unitPrice;

            $lineItems[] = [
                'product' => $product,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'container_borrowed_qty' => (int) ($item['container_borrowed_qty'] ?? 0),
            ];

            $total += $subtotal;
        }

        $cash = 0.0;
        $gcash = 0.0;
        $credit = 0.0;

        if ($validated['payment_method'] === 'cash') {
            $cash = $total;
        }

        if ($validated['payment_method'] === 'gcash') {
            $gcash = $total;
        }

        if ($validated['payment_method'] === 'credit') {
            $credit = $total;
        }

        if ($validated['payment_method'] === 'partial') {
            $cash = (float) ($validated['cash_amount'] ?? 0);
            $gcash = (float) ($validated['gcash_amount'] ?? 0);

            if (($cash + $gcash) > $total) {
                return back()->withErrors(['payment_method' => 'Partial cash and GCash cannot exceed total amount.'])->withInput();
            }

            $credit = $total - ($cash + $gcash);
        }

        DB::transaction(function () use ($validated, $lineItems, $total, $cash, $gcash, $credit, $request): void {
            $sale = Sale::query()->create([
                'customer_id' => $validated['customer_id'] ?? null,
                'recorded_by' => $request->user()?->id,
                'delivered_by' => $validated['delivered_by'] ?? null,
                'sale_date' => $validated['sale_date'],
                'payment_method' => $validated['payment_method'],
                'cash_amount' => $cash,
                'gcash_amount' => $gcash,
                'credit_amount' => $credit,
                'paid_credit_amount' => 0,
                'total_amount' => $total,
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($lineItems as $item) {
                $saleItem = $sale->items()->create([
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['subtotal'],
                    'container_borrowed_qty' => $item['container_borrowed_qty'],
                ]);

                if (
                    $sale->customer_id
                    && $item['product']->is_returnable
                    && ! empty($item['product']->container_type)
                    && $item['container_borrowed_qty'] > 0
                ) {
                    ContainerMovement::query()->create([
                        'customer_id' => $sale->customer_id,
                        'sale_id' => $sale->id,
                        'container_type' => $item['product']->container_type,
                        'quantity' => $item['container_borrowed_qty'],
                        'movement_type' => 'borrow',
                        'movement_date' => $sale->sale_date,
                        'notes' => 'Auto-recorded from sale item #'.$saleItem->id,
                    ]);
                }
            }
        });

        return redirect()->route('dashboard')->with('success', 'Sale recorded successfully.');
    }

    public function void(Sale $sale): RedirectResponse
    {
        if ($sale->status === 'void') {
            return back()->with('success', 'Sale is already voided.');
        }

        $sale->update([
            'status' => 'void',
            'voided_at' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Sale voided successfully.');
    }
}
