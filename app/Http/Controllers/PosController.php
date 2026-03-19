<?php

namespace App\Http\Controllers;

use App\Models\CollectionPayment;
use App\Models\ContainerMovement;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\InventoryCount;
use App\Models\PayrollEntry;
use App\Models\Product;
use App\Models\Sale;
use App\Models\WaterRestock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->toDateString();
        $historyDate = $request->query('date', $today);
        $payrollDate = $request->query('payroll_date', $today);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('is_walk_in')
            ->orderBy('name')
            ->get();

        $employees = Employee::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $recentSales = Sale::query()
            ->with('customer:id,name')
            ->whereDate('sale_date', $today)
            ->where('status', 'completed')
            ->latest('id')
            ->limit(20)
            ->get();

        $totals = [
            'sales' => (float) Sale::query()->whereDate('sale_date', $today)->where('status', 'completed')->sum('total_amount'),
            'cash_sales' => (float) Sale::query()->whereDate('sale_date', $today)->where('status', 'completed')->sum('cash_amount'),
            'gcash_sales' => (float) Sale::query()->whereDate('sale_date', $today)->where('status', 'completed')->sum('gcash_amount'),
            'credit_sales' => (float) Sale::query()->whereDate('sale_date', $today)->where('status', 'completed')->sum('credit_amount'),
            'expenses' => (float) Expense::query()->whereDate('expense_date', $today)->sum('amount'),
            'collections_cash' => (float) CollectionPayment::query()->whereDate('payment_date', $today)->where('payment_method', 'cash')->sum('amount'),
            'collections_gcash' => (float) CollectionPayment::query()->whereDate('payment_date', $today)->where('payment_method', 'gcash')->sum('amount'),
        ];

        $totals['cash_to_remit'] = $totals['cash_sales'] + $totals['collections_cash'] - $totals['expenses'];

        $unpaidBalances = Sale::query()
            ->select('customer_id')
            ->selectRaw('SUM(credit_amount - paid_credit_amount) AS outstanding')
            ->whereNotNull('customer_id')
            ->where('status', 'completed')
            ->groupBy('customer_id')
            ->havingRaw('SUM(credit_amount - paid_credit_amount) > 0')
            ->with('customer:id,name')
            ->get();

        $borrowedContainers = ContainerMovement::query()
            ->select('customer_id', 'container_type')
            ->selectRaw("SUM(CASE WHEN movement_type = 'borrow' THEN quantity ELSE 0 END) AS borrowed")
            ->selectRaw("SUM(CASE WHEN movement_type = 'return' THEN quantity ELSE 0 END) AS returned")
            ->selectRaw("SUM(CASE WHEN movement_type = 'lost' THEN quantity ELSE 0 END) AS lost")
            ->whereNotNull('customer_id')
            ->groupBy('customer_id', 'container_type')
            ->havingRaw("SUM(CASE WHEN movement_type = 'borrow' THEN quantity ELSE 0 END) - SUM(CASE WHEN movement_type = 'return' THEN quantity ELSE 0 END) - SUM(CASE WHEN movement_type = 'lost' THEN quantity ELSE 0 END) > 0")
            ->with('customer:id,name')
            ->orderBy('customer_id')
            ->get()
            ->map(function ($row) {
                $row->outstanding = (int) $row->borrowed - (int) $row->returned - (int) $row->lost;

                return $row;
            });

        $inventoryToday = InventoryCount::query()
            ->whereDate('count_date', $today)
            ->orderBy('ice_size')
            ->get();

        $waterRestocksToday = WaterRestock::query()
            ->whereDate('restock_date', $today)
            ->latest('id')
            ->get();

        $history = Sale::query()
            ->with('customer:id,name')
            ->whereDate('sale_date', $historyDate)
            ->latest('id')
            ->limit(30)
            ->get();

        $payrollToday = PayrollEntry::query()
            ->with('employee:id,name')
            ->whereDate('entry_date', $payrollDate)
            ->latest('id')
            ->limit(30)
            ->get();

        $startDate = now()->subDays(6)->toDateString();

        $salesTrend = Sale::query()
            ->selectRaw('DATE(sale_date) as date')
            ->selectRaw('SUM(total_amount) as total')
            ->whereBetween('sale_date', [$startDate, $today])
            ->where('status', 'completed')
            ->groupByRaw('DATE(sale_date)')
            ->orderByRaw('DATE(sale_date)')
            ->get();

        $topProducts = Product::query()
            ->join('sale_items', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.sale_date', [$startDate, $today])
            ->where('sales.status', 'completed')
            ->select('products.id', 'products.name')
            ->selectRaw('SUM(sale_items.quantity) as sold_qty')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold_qty')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'today' => $today,
            'products' => $products,
            'customers' => $customers,
            'employees' => $employees,
            'recentSales' => $recentSales,
            'unpaidBalances' => $unpaidBalances,
            'borrowedContainers' => $borrowedContainers,
            'inventoryToday' => $inventoryToday,
            'waterRestocksToday' => $waterRestocksToday,
            'history' => $history,
            'historyDate' => $historyDate,
            'payrollToday' => $payrollToday,
            'payrollDate' => $payrollDate,
            'salesTrend' => $salesTrend,
            'topProducts' => $topProducts,
            'totals' => $totals,
        ]);
    }
}
