<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'role',
        'employee_type',
        'daily_rate',
        'ot_rate',
        'late_rate',
        'sss_contribution',
        'philhealth_contribution',
        'pagibig_contribution',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'daily_rate' => 'decimal:2',
        'ot_rate' => 'decimal:2',
        'late_rate' => 'decimal:2',
        'sss_contribution' => 'decimal:2',
        'philhealth_contribution' => 'decimal:2',
        'pagibig_contribution' => 'decimal:2',
    ];

    public function payrollEntries(): HasMany
    {
        return $this->hasMany(PayrollEntry::class);
    }

    public function cashAdvances(): HasMany
    {
        return $this->hasMany(CashAdvance::class);
    }
}
