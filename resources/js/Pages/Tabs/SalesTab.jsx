import { FiSettings } from 'react-icons/fi';
import { Input, Select, money } from '@/Components/PosUI';

export default function SalesTab({
    salesForm,
    saleTotal,
    productsById,
    products,
    customers,
    selectedProduct,
    setSelectedProduct,
    posQty,
    setPosQty,
    posDiscount,
    setPosDiscount,
    posBorrowedQty,
    setPosBorrowedQty,
    addToCart,
    updateSaleItem,
    submitSale,
    openAddProduct,
}) {
    return (
        <section className="space-y-4">
            {/* Header row */}
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">New Sale</h3>
                    <button
                        type="button"
                        onClick={openAddProduct}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <FiSettings className="h-4 w-4" /> Products
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Input label="Sale Date" type="date" value={salesForm.data.sale_date} onChange={(v) => salesForm.setData('sale_date', v)} />
                    <Select
                        label="Customer"
                        value={salesForm.data.customer_id}
                        onChange={(v) => salesForm.setData('customer_id', v)}
                        options={customers.map((c) => ({ value: c.id, label: c.name }))}
                        placeholder="Walk-in"
                    />
                    <Input label="Delivered By" value={salesForm.data.delivered_by} onChange={(v) => salesForm.setData('delivered_by', v)} />
                    <Select
                        label="Payment Method"
                        value={salesForm.data.payment_method}
                        onChange={(v) => salesForm.setData('payment_method', v)}
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'gcash', label: 'GCash' },
                            { value: 'credit', label: 'Credit' },
                            { value: 'partial', label: 'Partial (Cash + GCash)' },
                        ]}
                    />
                </div>
            </div>

            {/* Product grid */}
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Select Product</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {products.filter((p) => p.is_active !== false).map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className={`rounded-md border px-3 py-3 text-left text-sm transition ${
                                selectedProduct?.id === product.id
                                    ? 'border-blue-500 bg-blue-50 font-semibold text-blue-700'
                                    : 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-blue-50 hover:border-blue-400'
                            }`}
                        >
                            <div className="font-medium leading-tight">{product.name}</div>
                            <div className="mt-1 text-xs text-gray-500">{money(product.price)}</div>
                        </button>
                    ))}
                </div>
                {selectedProduct && (
                    <div className="mt-3 flex flex-wrap items-end gap-3 rounded-md bg-blue-50 p-3">
                        <div>
                            <div className="text-sm font-semibold text-blue-800">{selectedProduct.name}</div>
                            <div className="text-xs text-blue-600">{money(selectedProduct.price)} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700">Qty</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={posQty}
                                onChange={(e) => setPosQty(e.target.value)}
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700">Discount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={posDiscount}
                                onChange={(e) => setPosDiscount(e.target.value)}
                                className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700">Borrowed Containers</label>
                            <input
                                type="number"
                                min="0"
                                value={posBorrowedQty}
                                onChange={(e) => setPosBorrowedQty(e.target.value)}
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addToCart}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            ADD TO CART
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedProduct(null)}
                            className="text-xs text-gray-500 underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Cart */}
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Order</h4>
                {salesForm.data.items.filter((i) => i.product_id).length === 0 ? (
                    <p className="text-sm text-gray-400">No items yet. Select a product above.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-xs uppercase text-gray-500">
                                <th className="py-1">Product</th>
                                <th className="py-1">Qty</th>
                                <th className="py-1">Discount</th>
                                <th className="py-1">Total</th>
                                <th className="py-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesForm.data.items.filter((i) => i.product_id).map((item, idx) => {
                                const prod = productsById[item.product_id];
                                const lineTotal = Math.max(0, Number(prod?.price || 0) * Number(item.quantity) - Number(item.discount));
                                return (
                                    <tr key={idx} className="border-b">
                                        <td className="py-1">{prod?.name || item.product_id}</td>
                                        <td className="py-1">
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateSaleItem(salesForm.data.items.indexOf(item), 'quantity', e.target.value)}
                                                className="w-16 rounded border border-gray-200 px-1 py-0.5 text-xs"
                                            />
                                        </td>
                                        <td className="py-1">{money(item.discount)}</td>
                                        <td className="py-1 font-medium">{money(lineTotal)}</td>
                                        <td className="py-1">
                                            <button
                                                type="button"
                                                onClick={() => salesForm.setData('items', salesForm.data.items.filter((_, i) => i !== salesForm.data.items.indexOf(item)))}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                <form onSubmit={submitSale} className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {(salesForm.data.payment_method === 'cash' || salesForm.data.payment_method === 'partial') && (
                            <Input label="Cash Amount" type="number" step="0.01" value={salesForm.data.cash_amount} onChange={(v) => salesForm.setData('cash_amount', v)} />
                        )}
                        {(salesForm.data.payment_method === 'gcash' || salesForm.data.payment_method === 'partial') && (
                            <Input label="GCash Amount" type="number" step="0.01" value={salesForm.data.gcash_amount} onChange={(v) => salesForm.setData('gcash_amount', v)} />
                        )}
                        <div className="flex flex-col justify-end">
                            <div className="rounded-md bg-gray-100 px-3 py-2 text-right">
                                <div className="text-xs text-gray-500">TOTAL</div>
                                <div className="text-xl font-bold text-gray-900">{money(saleTotal)}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            value={salesForm.data.notes}
                            onChange={(e) => salesForm.setData('notes', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            rows={2}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={salesForm.processing || salesForm.data.items.filter((i) => i.product_id).length === 0}
                        className="rounded-md bg-green-600 px-6 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        FINALIZE SALE
                    </button>
                </form>
            </div>
        </section>
    );
}
