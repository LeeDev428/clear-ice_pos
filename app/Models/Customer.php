<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'address',
        'is_walk_in',
        'is_active',
    ];

    protected $casts = [
        'is_walk_in' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function containerMovements(): HasMany
    {
        return $this->hasMany(ContainerMovement::class);
    }

    public function collectionPayments(): HasMany
    {
        return $this->hasMany(CollectionPayment::class);
    }
}
