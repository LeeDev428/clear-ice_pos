import {
    FiDollarSign,
    FiMinusCircle,
    FiCreditCard,
    FiTrendingUp,
    FiList,
    FiClock,
    FiBox,
    FiRefreshCw,
    FiPrinter,
} from 'react-icons/fi';
import { Input, SummaryCard, DataTable, money } from '@/Components/PosUI';

export default function DashboardTab({
    dashboardFrom,
    setDashboardFrom,
    dashboardTo,
    setDashboardTo,
    loadDashboard,
    dashboardTotals,
    outstandingDebt,
    salesTrend,
    soldProducts,
    soldByType,
    dailySalesReport,
    dailySalesReportTotals,
}) {
    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-end gap-3 rounded-md border border-gray-200 bg-white p-3">
                <Input label="From" type="date" value={dashboardFrom} onChange={setDashboardFrom} />
                <Input label="To" type="date" value={dashboardTo} onChange={setDashboardTo} />
                <button
                    type="button"
                    onClick={loadDashboard}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiRefreshCw /> View
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
                >
                    <FiPrinter /> Print Report
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <SummaryCard icon={<FiDollarSign />} title="Total Sales" value={money(dashboardTotals.sales)} />
                <SummaryCard icon={<FiMinusCircle />} title="Total Expense" value={money(dashboardTotals.expenses)} />
                <SummaryCard icon={<FiCreditCard />} title="Outstanding Debt" value={money(outstandingDebt)} />
                <SummaryCard icon={<FiTrendingUp />} title="Net" value={money(Number(dashboardTotals.sales || 0) - Number(dashboardTotals.expenses || 0))} />
            </div>
            {/* Sales breakdown by product category */}
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard icon={<FiDollarSign />} title="Ice Sales" value={money(dashboardTotals.ice_sales ?? 0)} />
                <SummaryCard icon={<FiDollarSign />} title="Water Sales" value={money(dashboardTotals.water_sales ?? 0)} />
                <SummaryCard icon={<FiDollarSign />} title="Others Sales" value={money(dashboardTotals.others_sales ?? 0)} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <SummaryCard icon={<FiDollarSign />} title="Cash Sales" value={money(dashboardTotals.cash_sales)} />
                <SummaryCard icon={<FiCreditCard />} title="GCash Sales" value={money(dashboardTotals.gcash_sales)} />
                <SummaryCard icon={<FiList />} title="Credit Sales" value={money(dashboardTotals.credit_sales)} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DataTable
                    title="Sold Products by Type"
                    icon={<FiList />}
                    headers={['Type', 'Sold Qty', 'Sold Amount']}
                    rows={(soldByType || []).map((row) => [
                        String(row.type || '-').toUpperCase(),
                        Number(row.sold_qty || 0),
                        money(row.sold_amount || 0),
                    ])}
                />
                <DataTable
                    title="All Sold Products"
                    icon={<FiBox />}
                    headers={['Product', 'Type', 'Sold Qty', 'Sold Amount']}
                    rows={(soldProducts || []).map((row) => [
                        row.name,
                        String(row.category || '-').toUpperCase(),
                        Number(row.sold_qty || 0),
                        money(row.sold_amount || 0),
                    ])}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DataTable
                    title="Sales Trend (Date Coverage)"
                    icon={<FiClock />}
                    headers={['Date', 'Total']}
                    rows={salesTrend.map((row) => [row.date, money(row.total)])}
                />
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                        <FiDollarSign /> Coverage Totals
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span className="text-gray-600">Sales</span><span className="font-medium">{money(dashboardTotals.sales)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-600">Expenses</span><span className="font-medium">{money(dashboardTotals.expenses)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-600">Collections (Cash)</span><span className="font-medium">{money(dashboardTotals.collections_cash)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-600">Cash to Remit</span><span className="font-semibold text-emerald-700">{money(dashboardTotals.cash_to_remit)}</span></div>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h4 className="mb-2 text-base font-semibold text-gray-900">Auto-generated Sales Report</h4>
                <p className="mb-3 text-xs text-gray-500">Coverage: {dashboardFrom} to {dashboardTo}</p>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="px-2 py-2">Date</th>
                                <th className="px-2 py-2">Ice</th>
                                <th className="px-2 py-2">Water</th>
                                <th className="px-2 py-2">Other</th>
                                <th className="px-2 py-2">Total Sales</th>
                                <th className="px-2 py-2">Exp (Cash)</th>
                                <th className="px-2 py-2">Exp (GCash)</th>
                                <th className="px-2 py-2">Total Exp</th>
                                <th className="px-2 py-2">Gross Income</th>
                                <th className="px-2 py-2">Cash Payment</th>
                                <th className="px-2 py-2">GCash Payment</th>
                                <th className="px-2 py-2">Credit</th>
                                <th className="px-2 py-2">Collection (Cash)</th>
                                <th className="px-2 py-2">Collection (GCash)</th>
                                <th className="px-2 py-2">Cash Remit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(dailySalesReport || []).length === 0 ? (
                                <tr>
                                    <td colSpan={15} className="px-2 py-4 text-center text-gray-500">No report data found for this coverage</td>
                                </tr>
                            ) : (
                                (dailySalesReport || []).map((row) => (
                                    <tr key={row.date} className="border-t border-gray-200">
                                        <td className="whitespace-nowrap px-2 py-2">{row.date}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.ice_sales)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.water_sales)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.other_sales)}</td>
                                        <td className="whitespace-nowrap px-2 py-2 font-medium">{money(row.total_sales)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.expenses_cash)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.expenses_gcash)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.total_expenses)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.gross_income)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.cash_payment)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.gcash_payment)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.credit)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.collection_cash)}</td>
                                        <td className="whitespace-nowrap px-2 py-2">{money(row.collection_gcash)}</td>
                                        <td className="whitespace-nowrap px-2 py-2 font-semibold text-emerald-700">{money(row.cash_remit)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
                                <td className="whitespace-nowrap px-2 py-2">TOTAL</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.ice_sales || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.water_sales || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.other_sales || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.total_sales || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.expenses_cash || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.expenses_gcash || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.total_expenses || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.gross_income || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.cash_payment || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.gcash_payment || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.credit || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.collection_cash || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2">{money(dailySalesReportTotals?.collection_gcash || 0)}</td>
                                <td className="whitespace-nowrap px-2 py-2 text-emerald-700">{money(dailySalesReportTotals?.cash_remit || 0)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </section>
    );
}
