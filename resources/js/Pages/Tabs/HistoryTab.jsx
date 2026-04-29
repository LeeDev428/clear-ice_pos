import { FiRefreshCw, FiPrinter, FiX, FiEdit2 } from 'react-icons/fi';
import { Input, money } from '@/Components/PosUI';

export default function HistoryTab({
    history,
    historyDate,
    setHistoryDate,
    loadHistory,
    openVoidModal,
    openEditSaleModal,
    setViewReceiptSale,
    setShowViewReceiptModal,
}) {
    return (
        <section className="rounded-md border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">History & Void</h3>
            <div className="mb-3 flex flex-wrap items-end gap-3">
                <Input label="Date" type="date" value={historyDate} onChange={setHistoryDate} />
                <button
                    type="button"
                    onClick={loadHistory}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiRefreshCw /> View
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Customer</th>
                            <th className="px-3 py-2">Method</th>
                            <th className="px-3 py-2">Total</th>
                            <th className="px-3 py-2">Staff</th>
                            <th className="px-3 py-2">Edited By</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row) => (
                            <tr key={row.id} className="border-t border-gray-200">
                                <td className="px-3 py-2">{row.sale_date}</td>
                                <td className="px-3 py-2">{row.customer?.name ?? 'Walk-in'}</td>
                                <td className="px-3 py-2 uppercase">{row.payment_method}</td>
                                <td className="px-3 py-2">{money(row.total_amount)}</td>
                                <td className="px-3 py-2">{row.recorder?.name ?? '-'}</td>
                                <td className="px-3 py-2 text-xs text-gray-500">{row.editor?.name ?? '-'}</td>
                                <td className="px-3 py-2">
                                    {row.status !== 'void' ? (
                                        <div className="flex gap-1 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => { setViewReceiptSale(row); setShowViewReceiptModal(true); }}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                                            >
                                                <FiPrinter size={12} /> Receipt
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openVoidModal(row)}
                                                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                            >
                                                <FiX size={12} /> Void
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEditSaleModal(row)}
                                                className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500" title={row.void_reason}>Voided</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
