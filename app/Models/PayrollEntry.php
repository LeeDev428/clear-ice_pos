<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollEntry extends Model
{
    protected $fillable = [
        'employee_id',
        'entry_date',
        'entry_type',
        'deduction_type',
        'shift_length',
        'shift_type',
        'expected_in',
        'actual_in',
        'actual_out',
        'lunch_break_minutes',
        'ot_approved',
        'ot_hours',
        'ot_rate',
        'amount',
        'bonus',
        'late_minutes',
        'late_deduction',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'amount' => 'decimal:2',
        'bonus' => 'decimal:2',
        'late_deduction' => 'decimal:2',
        'ot_hours' => 'decimal:2',
        'ot_rate' => 'decimal:2',
        'lunch_break_minutes' => 'integer',
        'late_minutes' => 'integer',
        'ot_approved' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
