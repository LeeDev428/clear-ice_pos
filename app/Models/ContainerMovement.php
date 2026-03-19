<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContainerMovement extends Model
{
    protected $fillable = [
        'customer_id',
        'sale_id',
        'container_type',
        'quantity',
        'movement_type',
        'movement_date',
        'notes',
    ];

    protected $casts = [
        'movement_date' => 'date',
        'quantity' => 'integer',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
