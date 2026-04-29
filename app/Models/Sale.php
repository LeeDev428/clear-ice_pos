<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'customer_id',
        'recorded_by',
        'delivered_by',
        'sale_date',
        'payment_method',
        'cash_amount',
        'gcash_amount',
        'credit_amount',
        'paid_credit_amount',
        'total_amount',
        'discount_amount',
        'status',
        'voided_at',
        'void_reason',
        'voided_by',
        'last_edited_by',
        'last_edited_at',
        'notes',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'voided_at' => 'datetime',
        'cash_amount' => 'decimal:2',
        'gcash_amount' => 'decimal:2',
        'credit_amount' => 'decimal:2',
        'paid_credit_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_edited_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function containerMovements(): HasMany
    {
        return $this->hasMany(ContainerMovement::class);
    }

    public function collectionPayments(): HasMany
    {
        return $this->hasMany(CollectionPayment::class);
    }

    public function getOutstandingCreditAttribute(): float
    {
        return (float) max(0, (float) $this->credit_amount - (float) $this->paid_credit_amount);
    }
}
