import { FiList, FiBox, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { Input, Select, money } from '@/Components/PosUI';

export default function RecordsTab({
    collectionForm,
    submitCollection,
    containerReturnForm,
    submitContainerReturn,
    customers,
    unpaidBalances,
    borrowedContainers,
    recordsSearch,
    setRecordsSearch,
    containerSearch,
    setContainerSearch,
    recordsFrom,
    setRecordsFrom,
    recordsTo,
    setRecordsTo,
    loadRecords,
    collectionsOnDate,
    containerReturnsOnDate,
}) {
    return (
        <section className="space-y-4">
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Records & Collections</h3>
                <form onSubmit={submitCollection} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Select
                        label="Customer"
                        value={collectionForm.data.customer_id}
                        onChange={(value) => collectionForm.setData('customer_id', value)}
                        options={customers.map((customer) => ({
                            value: customer.id,
                            label: customer.name,
                        }))}
                        placeholder="Select customer"
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={collectionForm.data.payment_date}
                        onChange={(value) => collectionForm.setData('payment_date', value)}
                    />
                    <Select
                        label="Method"
                        value={collectionForm.data.payment_method}
                        onChange={(value) => collectionForm.setData('payment_method', value)}
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'gcash', label: 'GCash' },
                        ]}
                    />
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        value={collectionForm.data.amount}
                        onChange={(value) => collectionForm.setData('amount', value)}
                    />
                    <div className="md:col-span-4">
                        <Input
                            label="Notes"
                            value={collectionForm.data.notes}
                            onChange={(value) => collectionForm.setData('notes', value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            SAVE COLLECTION
                        </button>
                    </div>
                </form>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Container Return</h3>
                <form onSubmit={submitContainerReturn} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Select
                        label="Customer"
                        value={containerReturnForm.data.customer_id}
                        onChange={(value) => containerReturnForm.setData('customer_id', value)}
                        options={customers.map((customer) => ({
                            value: customer.id,
                            label: customer.name,
                        }))}
                        placeholder="Select customer"
                    />
                    <Select
                        label="Container"
                        value={containerReturnForm.data.container_type}
                        onChange={(value) => containerReturnForm.setData('container_type', value)}
                        options={[
                            { value: 'gallon', label: 'Gallon' },
                            { value: 'big_styro', label: 'Big Styro' },
                            { value: 'small_styro', label: 'Small Styro' },
                            { value: 'sack', label: 'Sack' },
                        ]}
                    />
                    <Input
                        label="Quantity"
                        type="number"
                        value={containerReturnForm.data.quantity}
                        onChange={(value) => containerReturnForm.setData('quantity', value)}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={containerReturnForm.data.movement_date}
                        onChange={(value) => containerReturnForm.setData('movement_date', value)}
                    />
                    <div className="md:col-span-4">
                        <Input
                            label="Notes"
                            value={containerReturnForm.data.notes}
                            onChange={(value) => containerReturnForm.setData('notes', value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            SAVE RETURN
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                        <FiList /> Unpaid Balances
                    </h4>
                    <div className="mb-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search customer..."
                                value={recordsSearch}
                                onChange={(e) => setRecordsSearch(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-700">
                                    <th className="px-3 py-2">Customer</th>
                                    <th className="px-3 py-2">Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unpaidBalances
                                    .filter((row) =>
                                        !recordsSearch || (row.customer?.name || '').toLowerCase().includes(recordsSearch.toLowerCase())
                                    )
                                    .map((row, i) => (
                                        <tr key={`ub-${i}`} className="border-t border-gray-200">
                                            <td className="px-3 py-2">{row.customer?.name ?? 'Unknown'}</td>
                                            <td className="px-3 py-2">{money(row.outstanding)}</td>
                                        </tr>
                                    ))
                                }
                                {unpaidBalances.filter((row) =>
                                    !recordsSearch || (row.customer?.name || '').toLowerCase().includes(recordsSearch.toLowerCase())
                                ).length === 0 && (
                                    <tr><td colSpan={2} className="px-3 py-4 text-center text-gray-500">No data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                        <FiBox /> Borrowed Containers
                    </h4>
                    <div className="mb-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search customer..."
                                value={containerSearch}
                                onChange={(e) => setContainerSearch(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-700">
                                    <th className="px-3 py-2">Customer</th>
                                    <th className="px-3 py-2">Container</th>
                                    <th className="px-3 py-2">Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedContainers
                                    .filter((row) =>
                                        !containerSearch || (row.customer?.name || '').toLowerCase().includes(containerSearch.toLowerCase())
                                    )
                                    .map((row, i) => (
                                        <tr key={`bc-${i}`} className="border-t border-gray-200">
                                            <td className="px-3 py-2">{row.customer?.name ?? 'Unknown'}</td>
                                            <td className="px-3 py-2">{row.container_type}</td>
                                            <td className="px-3 py-2">{row.outstanding}</td>
                                        </tr>
                                    ))
                                }
                                {borrowedContainers.filter((row) =>
                                    !containerSearch || (row.customer?.name || '').toLowerCase().includes(containerSearch.toLowerCase())
                                ).length === 0 && (
                                    <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">No data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Date-filtered records history */}
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Records History</h3>
                <div className="mb-3 flex flex-wrap items-end gap-2">
                    <div>
                        <Input
                            label="From"
                            type="date"
                            value={recordsFrom}
                            onChange={setRecordsFrom}
                        />
                    </div>
                    <div>
                        <Input
                            label="To"
                            type="date"
                            value={recordsTo}
                            onChange={setRecordsTo}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={loadRecords}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <FiRefreshCw size={14} /> View
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Collections ({recordsFrom} – {recordsTo})</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-gray-700">
                                        <th className="px-3 py-2">Customer</th>
                                        <th className="px-3 py-2">Method</th>
                                        <th className="px-3 py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(collectionsOnDate || []).length === 0 ? (
                                        <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">No collections</td></tr>
                                    ) : (
                                        (collectionsOnDate || []).map((col) => (
                                            <tr key={col.id} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{col.customer?.name ?? '—'}</td>
                                                <td className="px-3 py-2 uppercase">{col.payment_method}</td>
                                                <td className="px-3 py-2">{money(col.amount)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Container Returns ({recordsFrom} – {recordsTo})</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-gray-700">
                                        <th className="px-3 py-2">Customer</th>
                                        <th className="px-3 py-2">Container</th>
                                        <th className="px-3 py-2">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(containerReturnsOnDate || []).length === 0 ? (
                                        <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">No returns</td></tr>
                                    ) : (
                                        (containerReturnsOnDate || []).map((ret) => (
                                            <tr key={ret.id} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{ret.customer?.name ?? '—'}</td>
                                                <td className="px-3 py-2">{ret.container_type}</td>
                                                <td className="px-3 py-2">{ret.quantity}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
