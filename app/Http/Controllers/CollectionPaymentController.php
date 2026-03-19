<?php

namespace App\Http\Controllers;

use App\Models\CollectionPayment;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CollectionPaymentController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'gcash'])],
            'amount' => ['required', 'numeric', 'gt:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($validated, $request): void {
            $remaining = (float) $validated['amount'];

            $sales = Sale::query()
                ->where('customer_id', $validated['customer_id'])
                ->where('status', 'completed')
                ->whereRaw('credit_amount > paid_credit_amount')
                ->orderBy('sale_date')
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            /** @var Sale $sale */
            foreach ($sales as $sale) {
                if ($remaining <= 0) {
                    break;
                }

                $outstanding = (float) $sale->credit_amount - (float) $sale->paid_credit_amount;
                if ($outstanding <= 0) {
                    continue;
                }

                $apply = min($remaining, $outstanding);
                $sale->increment('paid_credit_amount', $apply);

                CollectionPayment::query()->create([
                    'customer_id' => $validated['customer_id'],
                    'sale_id' => $sale->id,
                    'payment_date' => $validated['payment_date'],
                    'payment_method' => $validated['payment_method'],
                    'amount' => $apply,
                    'notes' => $validated['notes'] ?? null,
                    'recorded_by' => $request->user()?->id,
                ]);

                $remaining -= $apply;
            }

            if ($remaining > 0) {
                CollectionPayment::query()->create([
                    'customer_id' => $validated['customer_id'],
                    'sale_id' => null,
                    'payment_date' => $validated['payment_date'],
                    'payment_method' => $validated['payment_method'],
                    'amount' => $remaining,
                    'notes' => 'Advance payment. '.($validated['notes'] ?? ''),
                    'recorded_by' => $request->user()?->id,
                ]);
            }
        });

        return redirect()->route('dashboard')->with('success', 'Collection payment posted successfully.');
    }
}
