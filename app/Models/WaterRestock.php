<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaterRestock extends Model
{
    protected $fillable = [
        'restock_date',
        'item_name',
        'quantity',
        'unit',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'restock_date' => 'date',
        'quantity' => 'decimal:2',
    ];

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
