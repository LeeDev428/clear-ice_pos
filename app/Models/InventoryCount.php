<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryCount extends Model
{
    protected $fillable = [
        'count_date',
        'ice_size',
        'beginning_sacks',
        'harvested_today',
        'sold_today',
        'expected_count',
        'actual_ending_count',
        'variance',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'count_date' => 'date',
        'beginning_sacks' => 'decimal:2',
        'harvested_today' => 'decimal:2',
        'sold_today' => 'decimal:2',
        'expected_count' => 'decimal:2',
        'actual_ending_count' => 'decimal:2',
        'variance' => 'decimal:2',
    ];

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
