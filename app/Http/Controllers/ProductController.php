<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'ice_size' => ['nullable', 'string', 'max:50'],
            'container_type' => ['nullable', 'string', 'max:50'],
            'is_returnable' => ['nullable', 'boolean'],
            'track_inventory' => ['nullable', 'boolean'],
        ]);

        Product::query()->create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'ice_size' => $validated['ice_size'] ?? null,
            'container_type' => $validated['container_type'] ?? null,
            'is_returnable' => (bool) ($validated['is_returnable'] ?? false),
            'track_inventory' => (bool) ($validated['track_inventory'] ?? true),
            'is_active' => true,
        ]);

        return redirect()->route('dashboard')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'ice_size' => ['nullable', 'string', 'max:50'],
            'container_type' => ['nullable', 'string', 'max:50'],
            'is_returnable' => ['nullable', 'boolean'],
            'track_inventory' => ['nullable', 'boolean'],
        ]);

        $product->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'ice_size' => $validated['ice_size'] ?? null,
            'container_type' => $validated['container_type'] ?? null,
            'is_returnable' => (bool) ($validated['is_returnable'] ?? $product->is_returnable),
            'track_inventory' => (bool) ($validated['track_inventory'] ?? $product->track_inventory),
        ]);

        return redirect()->route('dashboard')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->update(['is_active' => false]);

        return redirect()->route('dashboard')->with('success', 'Product deactivated.');
    }
}
