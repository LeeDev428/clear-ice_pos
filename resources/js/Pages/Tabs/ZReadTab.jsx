import {
    FiDollarSign,
    FiCreditCard,
    FiList,
    FiPlus,
    FiMinusCircle,
    FiPercent,
    FiX,
    FiRefreshCw,
    FiPrinter,
} from 'react-icons/fi';
import { Input, SummaryCard, money } from '@/Components/PosUI';

export default function ZReadTab({
    zreadDate,
    setZreadDate,
    loadZread,
    zreadTotals,
    actualCashRemitted,
    setActualCashRemitted,
    zReadVariance,
}) {
    return (
        <section className="rounded-md border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">End of Day Report (Z-Read)</h3>

            <div className="mb-4 flex flex-wrap items-end gap-3">
                <Input label="Z-Read Date" type="date" value={zreadDate} onChange={setZreadDate} />
                <button
                    type="button"
                    onClick={loadZread}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiRefreshCw /> View
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
                >
                    <FiPrinter /> Print Z-Read
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <SummaryCard icon={<FiDollarSign />} title="Cash Sales" value={money(zreadTotals.cash_sales)} />
                <SummaryCard icon={<FiCreditCard />} title="GCash Sales" value={money(zreadTotals.gcash_sales)} />
                <SummaryCard icon={<FiList />} title="Unpaid / Credit" value={money(zreadTotals.credit_sales)} />
                <SummaryCard icon={<FiPlus />} title="Collections (Cash)" value={money(zreadTotals.collections_cash)} />
                <SummaryCard icon={<FiCreditCard />} title="Collections (GCash)" value={money(zreadTotals.collections_gcash)} />
                <SummaryCard icon={<FiMinusCircle />} title="Less: Expenses" value={money(zreadTotals.expenses)} />
                <SummaryCard icon={<FiPercent />} title="Total Discounts" value={money(zreadTotals.discount_total)} />
                <SummaryCard icon={<FiX />} title={`Void Txns (${zreadTotals.void_count})`} value={`${zreadTotals.sale_count} sales`} />
            </div>

            <div className="mt-4 rounded-md border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between text-base font-semibold text-gray-900">
                    <span>Cash To Remit</span>
                    <span>{money(zreadTotals.cash_to_remit)}</span>
                </div>

                <Input
                    label="Actual Cash Remitted"
                    type="number"
                    step="0.01"
                    value={actualCashRemitted}
                    onChange={setActualCashRemitted}
                />

                <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Variance</span>
                    <span className={zReadVariance > 0 ? 'font-semibold text-red-700' : 'font-semibold text-green-700'}>
                        {money(zReadVariance)}
                    </span>
                </div>
            </div>
        </section>
    );
}
