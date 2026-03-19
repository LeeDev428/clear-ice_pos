<?php

use App\Http\Controllers\CollectionPaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InventoryCountController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\SaleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PosController::class, 'index'])->name('dashboard');

    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::patch('/sales/{sale}/void', [SaleController::class, 'void'])->name('sales.void');

    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::post('/inventory-counts', [InventoryCountController::class, 'store'])->name('inventory-counts.store');
    Route::post('/collections', [CollectionPaymentController::class, 'store'])->name('collections.store');

    Route::post('/records/container-return', [RecordController::class, 'returnContainer'])->name('records.container-return');
    Route::get('/records/history', [RecordController::class, 'history'])->name('records.history');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
