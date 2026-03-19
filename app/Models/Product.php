<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'ice_size',
        'container_type',
        'price',
        'is_returnable',
        'track_inventory',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_returnable' => 'boolean',
        'track_inventory' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}
