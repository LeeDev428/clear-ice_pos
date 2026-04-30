<?php

use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CollectionPaymentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InventoryCountController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\WaterRestockController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PosController::class, 'index'])->name('dashboard');

    // Sales
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::patch('/sales/{sale}/void', [SaleController::class, 'void'])->name('sales.void');
    Route::patch('/sales/{sale}', [SaleController::class, 'update'])->name('sales.update');

    // Products (CRUD)
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::patch('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Expenses
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::patch('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

    // Inventory / Water / Collections
    Route::post('/inventory-counts', [InventoryCountController::class, 'store'])->name('inventory-counts.store');
    Route::post('/water-restocks', [WaterRestockController::class, 'store'])->name('water-restocks.store');
    Route::post('/collections', [CollectionPaymentController::class, 'store'])->name('collections.store');

    // Payroll
    Route::post('/payroll-entries', [PayrollController::class, 'store'])->name('payroll.store');
    Route::post('/payroll/finalize', [PayrollController::class, 'finalize'])->name('payroll.finalize');

    // Employees (CRUD)
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::patch('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');

    // Cash Advances
    Route::post('/cash-advances', [CashAdvanceController::class, 'store'])->name('cash-advances.store');

    // Customers (CRUD)
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::patch('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Records
    Route::post('/records/container-return', [RecordController::class, 'returnContainer'])->name('records.container-return');
    Route::get('/records/history', [RecordController::class, 'history'])->name('records.history');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
