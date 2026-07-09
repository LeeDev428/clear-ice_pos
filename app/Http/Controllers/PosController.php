<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CollectionPayment;
use App\Models\ContainerMovement;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\InventoryCount;
use App\Models\PayrollEntry;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use App\Models\WaterRestock;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->toDateString();
        $historyFrom   = $request->query('history_from', $today);
        $historyTo     = $request->query('history_to', $today);
        $payrollFrom   = $request->query('payroll_from', $today);
        $payrollTo     = $request->query('payroll_to', $today);
        $zreadDate     = $request->query('zread_date', $today);
        $inventoryDate = $request->query('inventory_date', $today);
        $dashboardFrom = $request->query('dashboard_from', $request->query('dashboard_date', $today));
        $dashboardTo   = $request->query('dashboard_to', $request->query('dashboard_date', $today));
        $expensesFrom  = $request->query('expenses_from', $today);
        $expensesTo    = $request->query('expenses_to', $today);
        $recordsFrom   = $request->query('records_from', $today);
        $recordsTo     = $request->query('records_to', $today);
        $balancesFrom  = $request->query('balances_from');
        $balancesTo    = $request->query('balances_to');

        if ($dashboardFrom > $dashboardTo) {
            [$dashboardFrom, $dashboardTo] = [$dashboardTo, $dashboardFrom];
        }

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

        $allCustomers = Customer::query()
            ->orderBy('is_walk_in')
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'address', 'is_walk_in', 'is_active']);

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

        // Category breakdown helper (ice / water / other)
        $salesByCategoryOnDate = function (string $date): array {
            return DB::table('sale_items')
                ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
                ->join('products', 'products.id', '=', 'sale_items.product_id')
                ->whereDate('sales.sale_date', $date)
                ->where('sales.status', 'completed')
                ->selectRaw('products.category, SUM(sale_items.subtotal) as total')
                ->groupBy('products.category')
                ->pluck('total', 'category')
                ->toArray();
        };

        $salesByCategoryInRange = function (string $from, string $to): array {
            return DB::table('sale_items')
                ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
                ->join('products', 'products.id', '=', 'sale_items.product_id')
                ->whereBetween('sales.sale_date', [$from, $to])
                ->where('sales.status', 'completed')
                ->selectRaw('products.category, SUM(sale_items.subtotal) as total')
                ->groupBy('products.category')
                ->pluck('total', 'category')
                ->toArray();
        };

        $zreadCats = $salesByCategoryOnDate($zreadDate);
        $zreadTotals['ice_sales']    = (float) ($zreadCats['ice']   ?? 0);
        $zreadTotals['water_sales']  = (float) ($zreadCats['water'] ?? 0);
        $zreadTotals['others_sales'] = (float) ($zreadCats['other'] ?? 0);

        // Dashboard date-range report
        $dashboardTotals = [
            'sales' => (float) Sale::query()->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])->where('status', 'completed')->sum('total_amount'),
            'cash_sales' => (float) Sale::query()->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])->where('status', 'completed')->sum('cash_amount'),
            'gcash_sales' => (float) Sale::query()->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])->where('status', 'completed')->sum('gcash_amount'),
            'credit_sales' => (float) Sale::query()->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])->where('status', 'completed')->sum('credit_amount'),
            'expenses' => (float) Expense::query()->whereBetween('expense_date', [$dashboardFrom, $dashboardTo])->sum('amount'),
            'collections_cash' => (float) CollectionPayment::query()->whereBetween('payment_date', [$dashboardFrom, $dashboardTo])->where('payment_method', 'cash')->sum('amount'),
            'collections_gcash' => (float) CollectionPayment::query()->whereBetween('payment_date', [$dashboardFrom, $dashboardTo])->where('payment_method', 'gcash')->sum('amount'),
        ];
        $dashboardTotals['cash_to_remit'] = $dashboardTotals['cash_sales'] + $dashboardTotals['collections_cash'] - $dashboardTotals['expenses'];

        $dashCats = $salesByCategoryInRange($dashboardFrom, $dashboardTo);
        $dashboardTotals['ice_sales']    = (float) ($dashCats['ice']   ?? 0);
        $dashboardTotals['water_sales']  = (float) ($dashCats['water'] ?? 0);
        $dashboardTotals['others_sales'] = (float) ($dashCats['other'] ?? 0);

        $salesByDay = Sale::query()
            ->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])
            ->where('status', 'completed')
            ->selectRaw('DATE(sale_date) as report_date')
            ->selectRaw('SUM(total_amount) as total_sales')
            ->selectRaw('SUM(cash_amount) as cash_payment')
            ->selectRaw('SUM(gcash_amount) as gcash_payment')
            ->selectRaw('SUM(credit_amount) as credit')
            ->groupByRaw('DATE(sale_date)')
            ->get()
            ->keyBy('report_date');

        $categorySalesByDay = DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->whereBetween('sales.sale_date', [$dashboardFrom, $dashboardTo])
            ->where('sales.status', 'completed')
            ->selectRaw('DATE(sales.sale_date) as report_date, products.category, SUM(sale_items.subtotal) as total')
            ->groupByRaw('DATE(sales.sale_date), products.category')
            ->get()
            ->groupBy('report_date')
            ->map(fn ($rows) => $rows->pluck('total', 'category'));

        $expensesByDay = Expense::query()
            ->whereBetween('expense_date', [$dashboardFrom, $dashboardTo])
            ->selectRaw('expense_date as report_date')
            ->selectRaw("SUM(CASE WHEN payment_source = 'cash' THEN amount ELSE 0 END) as expenses_cash")
            ->selectRaw("SUM(CASE WHEN payment_source = 'gcash' THEN amount ELSE 0 END) as expenses_gcash")
            ->selectRaw('SUM(amount) as total_expenses')
            ->groupBy('expense_date')
            ->get()
            ->keyBy('report_date');

        $collectionsByDay = CollectionPayment::query()
            ->whereBetween('payment_date', [$dashboardFrom, $dashboardTo])
            ->selectRaw('payment_date as report_date')
            ->selectRaw("SUM(CASE WHEN payment_method = 'cash' THEN amount ELSE 0 END) as collection_cash")
            ->selectRaw("SUM(CASE WHEN payment_method = 'gcash' THEN amount ELSE 0 END) as collection_gcash")
            ->groupBy('payment_date')
            ->get()
            ->keyBy('report_date');

        $dailySalesReport = collect();
        $cursor = Carbon::parse($dashboardFrom);
        $rangeEnd = Carbon::parse($dashboardTo);

        while ($cursor->lte($rangeEnd)) {
            $dateKey = $cursor->toDateString();
            $salesRow = $salesByDay->get($dateKey);
            $expensesRow = $expensesByDay->get($dateKey);
            $collectionsRow = $collectionsByDay->get($dateKey);
            $categoryRow = $categorySalesByDay->get($dateKey, collect());

            $iceSales = (float) ($categoryRow['ice'] ?? 0);
            $waterSales = (float) ($categoryRow['water'] ?? 0);
            $otherSales = (float) ($categoryRow['other'] ?? 0);
            $totalSales = (float) ($salesRow->total_sales ?? 0);
            $expensesCash = (float) ($expensesRow->expenses_cash ?? 0);
            $expensesGcash = (float) ($expensesRow->expenses_gcash ?? 0);
            $totalExpenses = (float) ($expensesRow->total_expenses ?? 0);
            $cashPayment = (float) ($salesRow->cash_payment ?? 0);
            $gcashPayment = (float) ($salesRow->gcash_payment ?? 0);
            $credit = (float) ($salesRow->credit ?? 0);
            $collectionCash = (float) ($collectionsRow->collection_cash ?? 0);
            $collectionGcash = (float) ($collectionsRow->collection_gcash ?? 0);

            $dailySalesReport->push([
                'date' => $dateKey,
                'ice_sales' => $iceSales,
                'water_sales' => $waterSales,
                'other_sales' => $otherSales,
                'total_sales' => $totalSales,
                'expenses_cash' => $expensesCash,
                'expenses_gcash' => $expensesGcash,
                'total_expenses' => $totalExpenses,
                'gross_income' => $totalSales - $totalExpenses,
                'cash_payment' => $cashPayment,
                'gcash_payment' => $gcashPayment,
                'credit' => $credit,
                'collection_cash' => $collectionCash,
                'collection_gcash' => $collectionGcash,
                'cash_remit' => $cashPayment + $collectionCash - $expensesCash,
            ]);

            $cursor->addDay();
        }

        $dailySalesReportTotals = [
            'ice_sales' => (float) $dailySalesReport->sum('ice_sales'),
            'water_sales' => (float) $dailySalesReport->sum('water_sales'),
            'other_sales' => (float) $dailySalesReport->sum('other_sales'),
            'total_sales' => (float) $dailySalesReport->sum('total_sales'),
            'expenses_cash' => (float) $dailySalesReport->sum('expenses_cash'),
            'expenses_gcash' => (float) $dailySalesReport->sum('expenses_gcash'),
            'total_expenses' => (float) $dailySalesReport->sum('total_expenses'),
            'gross_income' => (float) $dailySalesReport->sum('gross_income'),
            'cash_payment' => (float) $dailySalesReport->sum('cash_payment'),
            'gcash_payment' => (float) $dailySalesReport->sum('gcash_payment'),
            'credit' => (float) $dailySalesReport->sum('credit'),
            'collection_cash' => (float) $dailySalesReport->sum('collection_cash'),
            'collection_gcash' => (float) $dailySalesReport->sum('collection_gcash'),
            'cash_remit' => (float) $dailySalesReport->sum('cash_remit'),
        ];

        $unpaidSales = Sale::query()
            ->with(['customer:id,name', 'items.product:id,name,price', 'recorder:id,name'])
            ->whereNotNull('customer_id')
            ->where('status', 'completed')
            ->whereRaw('credit_amount > paid_credit_amount')
            ->when($balancesFrom && $balancesTo, function ($q) use ($balancesFrom, $balancesTo) {
                $q->whereBetween('sale_date', [$balancesFrom, $balancesTo]);
            })
            ->orderBy('sale_date')
            ->orderBy('id')
            ->get();

        $unpaidSalesByCustomer = $unpaidSales->groupBy('customer_id');

        $unpaidBalances = Sale::query()
            ->select('customer_id')
            ->selectRaw('SUM(credit_amount - paid_credit_amount) AS outstanding')
            ->whereNotNull('customer_id')
            ->where('status', 'completed')
            ->when($balancesFrom && $balancesTo, function ($q) use ($balancesFrom, $balancesTo) {
                $q->whereBetween('sale_date', [$balancesFrom, $balancesTo]);
            })
            ->groupBy('customer_id')
            ->havingRaw('SUM(credit_amount - paid_credit_amount) > 0')
            ->with('customer:id,name')
            ->get()
            ->map(function ($row) use ($unpaidSalesByCustomer) {
                $row->unpaid_sales = ($unpaidSalesByCustomer->get($row->customer_id) ?? collect())->values();

                return $row;
            });

        $totalOutstandingAmount = (float) $unpaidBalances->sum('outstanding');

        $borrowedContainers = ContainerMovement::query()
            ->select('customer_id', 'container_type')
            ->selectRaw("SUM(CASE WHEN movement_type = 'borrow' THEN quantity ELSE 0 END) AS borrowed")
            ->selectRaw("SUM(CASE WHEN movement_type = 'return' THEN quantity ELSE 0 END) AS returned")
            ->selectRaw("SUM(CASE WHEN movement_type = 'lost' THEN quantity ELSE 0 END) AS lost")
            ->whereNotNull('customer_id')
            ->when($balancesFrom && $balancesTo, function ($q) use ($balancesFrom, $balancesTo) {
                $q->whereBetween('movement_date', [$balancesFrom, $balancesTo]);
            })
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
            ->whereDate('count_date', $inventoryDate)
            ->orderBy('ice_size')
            ->get();

        $waterRestocksToday = WaterRestock::query()
            ->whereDate('restock_date', $inventoryDate)
            ->latest('id')
            ->get();

        $history = Sale::query()
            ->with(['customer:id,name', 'items.product:id,name,price', 'recorder:id,name', 'editor:id,name'])
            ->whereBetween('sale_date', [$historyFrom, $historyTo])
            ->latest('id')
            ->limit(200)
            ->get();

        $payrollToday = PayrollEntry::query()
            ->with('employee:id,name')
            ->whereBetween('entry_date', [$payrollFrom, $payrollTo])
            ->latest('id')
            ->limit(200)
            ->get();

        $expensesToday = Expense::query()
            ->whereBetween('expense_date', [$expensesFrom, $expensesTo])
            ->latest('id')
            ->get();

        // Cash advances (latest 100 for payroll tab)
        $cashAdvances = CashAdvance::query()
            ->with('employee:id,name')
            ->latest('advance_date')
            ->limit(100)
            ->get();

        // Collections and container returns for selected date (Records tab)
        $collectionsOnDate = CollectionPayment::query()
            ->with('customer:id,name')
            ->whereBetween('payment_date', [$recordsFrom, $recordsTo])
            ->latest('id')
            ->get();

        $containerReturnsOnDate = ContainerMovement::query()
            ->with('customer:id,name')
            ->whereBetween('movement_date', [$recordsFrom, $recordsTo])
            ->where('movement_type', 'return')
            ->latest('id')
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

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'is_active']);

        $salesTrend = Sale::query()
            ->selectRaw('DATE(sale_date) as date')
            ->selectRaw('SUM(total_amount) as total')
            ->whereBetween('sale_date', [$dashboardFrom, $dashboardTo])
            ->where('status', 'completed')
            ->groupByRaw('DATE(sale_date)')
            ->orderByRaw('DATE(sale_date)')
            ->get();

        $soldProducts = Product::query()
            ->join('sale_items', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.sale_date', [$dashboardFrom, $dashboardTo])
            ->where('sales.status', 'completed')
            ->select('products.id', 'products.name', 'products.category')
            ->selectRaw('SUM(sale_items.quantity) as sold_qty')
            ->selectRaw('SUM(sale_items.subtotal) as sold_amount')
            ->groupBy('products.id', 'products.name', 'products.category')
            ->orderByDesc('sold_qty')
            ->get();

        $soldByType = DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->whereBetween('sales.sale_date', [$dashboardFrom, $dashboardTo])
            ->where('sales.status', 'completed')
            ->selectRaw('products.category as type')
            ->selectRaw('SUM(sale_items.quantity) as sold_qty')
            ->selectRaw('SUM(sale_items.subtotal) as sold_amount')
            ->groupBy('products.category')
            ->orderBy('products.category')
            ->get();

        return Inertia::render('Dashboard', [
            'today' => $today,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'products' => $products,
            'customers' => $customers,
            'allCustomers' => $allCustomers,
            'employees' => $employees,
            'users' => $users,
            'recentSales' => $recentSales,
            'unpaidBalances' => $unpaidBalances,
            'borrowedContainers' => $borrowedContainers,
            'balancesFrom' => $balancesFrom,
            'balancesTo' => $balancesTo,
            'totalOutstandingAmount' => $totalOutstandingAmount,
            'inventoryDate' => $inventoryDate,
            'inventoryToday' => $inventoryToday,
            'waterRestocksToday' => $waterRestocksToday,
            'history' => $history,
            'historyFrom' => $historyFrom,
            'historyTo' => $historyTo,
            'payrollToday' => $payrollToday,
            'payrollFrom' => $payrollFrom,
            'payrollTo' => $payrollTo,
            'expensesToday' => $expensesToday,
            'expensesFrom' => $expensesFrom,
            'expensesTo' => $expensesTo,
            'expenseCategories' => ExpenseCategory::orderBy('name')->get(['id', 'name']),
            'collectionsOnDate' => $collectionsOnDate,
            'containerReturnsOnDate' => $containerReturnsOnDate,
            'recordsFrom' => $recordsFrom,
            'recordsTo' => $recordsTo,
            'salesTrend' => $salesTrend,
            'soldProducts' => $soldProducts,
            'soldByType' => $soldByType,
            'dailySalesReport' => $dailySalesReport,
            'dailySalesReportTotals' => $dailySalesReportTotals,
            'totals' => $totals,
            'zreadDate' => $zreadDate,
            'zreadTotals' => $zreadTotals,
            'dashboardFrom' => $dashboardFrom,
            'dashboardTo' => $dashboardTo,
            'dashboardTotals' => $dashboardTotals,
            'cashAdvances' => $cashAdvances,
            'periodTimeLogs' => $periodTimeLogs,
            'periodEmployee' => $periodEmployee,
            'periodStart' => $periodStart,
            'periodEnd' => $periodEnd,
        ]);
    }
}
