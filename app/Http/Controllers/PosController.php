<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
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
        $zreadDate = $request->query('zread_date', $today);
        $dashboardDate = $request->query('dashboard_date', $today);

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

        // All active employees with rate data (for payroll calculations)
        $employees = Employee::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'employee_type', 'daily_rate', 'ot_rate', 'late_rate',
                   'sss_contribution', 'philhealth_contribution', 'pagibig_contribution', 'is_active']);

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

        // Z-Read totals for selected date
        $zreadTotals = [
            'sales' => (float) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->sum('total_amount'),
            'cash_sales' => (float) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->sum('cash_amount'),
            'gcash_sales' => (float) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->sum('gcash_amount'),
            'credit_sales' => (float) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->sum('credit_amount'),
            'expenses' => (float) Expense::query()->whereDate('expense_date', $zreadDate)->sum('amount'),
            'collections_cash' => (float) CollectionPayment::query()->whereDate('payment_date', $zreadDate)->where('payment_method', 'cash')->sum('amount'),
            'collections_gcash' => (float) CollectionPayment::query()->whereDate('payment_date', $zreadDate)->where('payment_method', 'gcash')->sum('amount'),
            'discount_total' => (float) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->sum('discount_amount'),
            'void_count' => (int) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'void')->count(),
            'sale_count' => (int) Sale::query()->whereDate('sale_date', $zreadDate)->where('status', 'completed')->count(),
        ];
        $zreadTotals['cash_to_remit'] = $zreadTotals['cash_sales'] + $zreadTotals['collections_cash'] - $zreadTotals['expenses'];

        // Dashboard per-day report
        $dashboardTotals = [
            'sales' => (float) Sale::query()->whereDate('sale_date', $dashboardDate)->where('status', 'completed')->sum('total_amount'),
            'cash_sales' => (float) Sale::query()->whereDate('sale_date', $dashboardDate)->where('status', 'completed')->sum('cash_amount'),
            'gcash_sales' => (float) Sale::query()->whereDate('sale_date', $dashboardDate)->where('status', 'completed')->sum('gcash_amount'),
            'credit_sales' => (float) Sale::query()->whereDate('sale_date', $dashboardDate)->where('status', 'completed')->sum('credit_amount'),
            'expenses' => (float) Expense::query()->whereDate('expense_date', $dashboardDate)->sum('amount'),
            'collections_cash' => (float) CollectionPayment::query()->whereDate('payment_date', $dashboardDate)->where('payment_method', 'cash')->sum('amount'),
            'collections_gcash' => (float) CollectionPayment::query()->whereDate('payment_date', $dashboardDate)->where('payment_method', 'gcash')->sum('amount'),
        ];
        $dashboardTotals['cash_to_remit'] = $dashboardTotals['cash_sales'] + $dashboardTotals['collections_cash'] - $dashboardTotals['expenses'];

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
            ->with(['customer:id,name', 'items.product:id,name,price', 'recorder:id,name', 'editor:id,name'])
            ->whereDate('sale_date', $historyDate)
            ->latest('id')
            ->limit(50)
            ->get();

        $payrollToday = PayrollEntry::query()
            ->with('employee:id,name')
            ->whereDate('entry_date', $payrollDate)
            ->latest('id')
            ->limit(30)
            ->get();

        $expensesToday = Expense::query()
            ->whereDate('expense_date', $today)
            ->latest('id')
            ->get();

        // Cash advances (latest 100 for payroll tab)
        $cashAdvances = CashAdvance::query()
            ->with('employee:id,name')
            ->latest('advance_date')
            ->limit(100)
            ->get();

        // Period time logs for payroll process calculation
        $periodTimeLogs = collect();
        $periodEmployee = $request->query('period_employee');
        $periodStart = $request->query('period_start');
        $periodEnd = $request->query('period_end');

        if ($periodEmployee && $periodStart && $periodEnd) {
            $periodTimeLogs = PayrollEntry::query()
                ->with('employee:id,name,daily_rate,ot_rate,late_rate,sss_contribution,philhealth_contribution,pagibig_contribution')
                ->where('employee_id', $periodEmployee)
                ->where('entry_type', 'time_log')
                ->whereBetween('entry_date', [$periodStart, $periodEnd])
                ->orderBy('entry_date')
                ->get();
        }

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
            'expensesToday' => $expensesToday,
            'salesTrend' => $salesTrend,
            'topProducts' => $topProducts,
            'totals' => $totals,
            'zreadDate' => $zreadDate,
            'zreadTotals' => $zreadTotals,
            'dashboardDate' => $dashboardDate,
            'dashboardTotals' => $dashboardTotals,
            'cashAdvances' => $cashAdvances,
            'periodTimeLogs' => $periodTimeLogs,
            'periodEmployee' => $periodEmployee,
            'periodStart' => $periodStart,
            'periodEnd' => $periodEnd,
        ]);
    }
}
