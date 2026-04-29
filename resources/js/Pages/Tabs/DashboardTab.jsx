import {
    FiDollarSign,
    FiMinusCircle,
    FiCreditCard,
    FiTrendingUp,
    FiList,
    FiClock,
    FiBox,
    FiRefreshCw,
} from 'react-icons/fi';
import { Input, SummaryCard, DataTable, money } from '@/Components/PosUI';

export default function DashboardTab({
    dashboardDate,
    setDashboardDate,
    loadDashboard,
    dashboardTotals,
    outstandingDebt,
    salesTrend,
    topProducts,
}) {
    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-end gap-3 rounded-md border border-gray-200 bg-white p-3">
                <Input label="Report Date" type="date" value={dashboardDate} onChange={setDashboardDate} />
                <button
                    type="button"
                    onClick={loadDashboard}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiRefreshCw /> View
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <SummaryCard icon={<FiDollarSign />} title="Total Sales" value={money(dashboardTotals.sales)} />
                <SummaryCard icon={<FiMinusCircle />} title="Total Expense" value={money(dashboardTotals.expenses)} />
                <SummaryCard icon={<FiCreditCard />} title="Outstanding Debt" value={money(outstandingDebt)} />
                <SummaryCard icon={<FiTrendingUp />} title="Net" value={money(Number(dashboardTotals.sales || 0) - Number(dashboardTotals.expenses || 0))} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <SummaryCard icon={<FiDollarSign />} title="Cash Sales" value={money(dashboardTotals.cash_sales)} />
                <SummaryCard icon={<FiCreditCard />} title="GCash Sales" value={money(dashboardTotals.gcash_sales)} />
                <SummaryCard icon={<FiList />} title="Credit Sales" value={money(dashboardTotals.credit_sales)} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DataTable
                    title="Sales Trend (7 Days)"
                    icon={<FiClock />}
                    headers={['Date', 'Total']}
                    rows={salesTrend.map((row) => [row.date, money(row.total)])}
                />
                <DataTable
                    title="Top Selling Products"
                    icon={<FiBox />}
                    headers={['Product', 'Sold Qty']}
                    rows={topProducts.map((row) => [row.name, Number(row.sold_qty || 0)])}
                />
            </div>
        </section>
    );
}
