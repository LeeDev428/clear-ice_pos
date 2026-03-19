import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    FiBox,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiFileText,
    FiList,
    FiMinusCircle,
    FiPlus,
    FiRefreshCw,
    FiTruck,
    FiTrendingUp,
    FiUsers,
} from 'react-icons/fi';

const TABS = [
    'Sales',
    'Inventory',
    'Expenses',
    'Records',
    'History',
    'Dashboard',
    'Z-Read',
    'Payroll',
];

const money = (value) => `PHP ${Number(value || 0).toFixed(2)}`;

export default function Dashboard({
    today,
    historyDate: historyDateProp,
    payrollDate: payrollDateProp,
    products,
    customers,
    employees,
    recentSales,
    unpaidBalances,
    borrowedContainers,
    inventoryToday,
    waterRestocksToday,
    history,
    payrollToday,
    salesTrend,
    topProducts,
    totals,
}) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('Sales');
    const [historyDate, setHistoryDate] = useState(historyDateProp || today);
    const [payrollDate, setPayrollDate] = useState(payrollDateProp || today);
    const [actualCashRemitted, setActualCashRemitted] = useState('');
    const [inventoryMode, setInventoryMode] = useState('daily');

    const salesForm = useForm({
        sale_date: today,
        customer_id: '',
        delivered_by: '',
        payment_method: 'cash',
        cash_amount: 0,
        gcash_amount: 0,
        notes: '',
        items: [{ product_id: '', quantity: 1, container_borrowed_qty: 0 }],
    });

    const expenseForm = useForm({
        expense_date: today,
        transaction_type: 'regular',
        category: 'Auto Repair',
        description: '',
        amount: '',
        payment_source: 'cash',
    });

    const inventoryForm = useForm({
        count_date: today,
        ice_size: '28mm',
        beginning_sacks: 0,
        harvested_today: 0,
        actual_ending_count: 0,
        notes: '',
    });

    const waterRestockForm = useForm({
        restock_date: today,
        item_name: 'Bottled Water',
        quantity: '',
        unit: 'case',
        notes: '',
    });

    const collectionForm = useForm({
        customer_id: '',
        payment_date: today,
        payment_method: 'cash',
        amount: '',
        notes: '',
    });

    const containerReturnForm = useForm({
        customer_id: '',
        container_type: 'gallon',
        quantity: 1,
        movement_date: today,
        notes: '',
    });

    const payrollForm = useForm({
        entry_date: today,
        employee_id: '',
        entry_type: 'time_log',
        shift_length: 'Full Day (100% Rate)',
        expected_in: '',
        actual_in: '',
        actual_out: '',
        lunch_break_minutes: 0,
        amount: '',
        notes: '',
    });

    const productsById = useMemo(() => {
        const map = {};
        products.forEach((product) => {
            map[product.id] = product;
        });

        return map;
    }, [products]);

    const saleTotal = useMemo(() => {
        return salesForm.data.items.reduce((sum, item) => {
            const product = productsById[item.product_id];
            if (!product) {
                return sum;
            }

            return sum + Number(item.quantity || 0) * Number(product.price || 0);
        }, 0);
    }, [productsById, salesForm.data.items]);

    const outstandingDebt = useMemo(() => {
        return unpaidBalances.reduce((sum, row) => sum + Number(row.outstanding || 0), 0);
    }, [unpaidBalances]);

    const zReadVariance = useMemo(() => {
        const actual = Number(actualCashRemitted || 0);

        return Number(totals.cash_to_remit || 0) - actual;
    }, [actualCashRemitted, totals.cash_to_remit]);

    const addSaleItem = () => {
        salesForm.setData('items', [
            ...salesForm.data.items,
            { product_id: '', quantity: 1, container_borrowed_qty: 0 },
        ]);
    };

    const removeSaleItem = (index) => {
        if (salesForm.data.items.length === 1) {
            return;
        }

        salesForm.setData(
            'items',
            salesForm.data.items.filter((_, i) => i !== index),
        );
    };

    const updateSaleItem = (index, key, value) => {
        const next = [...salesForm.data.items];
        next[index] = { ...next[index], [key]: value };
        salesForm.setData('items', next);
    };

    const submitSale = (event) => {
        event.preventDefault();
        salesForm
            .transform((data) => ({
                ...data,
                customer_id: data.customer_id ? Number(data.customer_id) : null,
                cash_amount: Number(data.cash_amount || 0),
                gcash_amount: Number(data.gcash_amount || 0),
                items: data.items
                    .filter((item) => item.product_id)
                    .map((item) => ({
                        ...item,
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity || 0),
                        container_borrowed_qty: Number(item.container_borrowed_qty || 0),
                    })),
            }))
            .post(route('sales.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    salesForm.reset('delivered_by', 'cash_amount', 'gcash_amount', 'notes');
                    salesForm.setData('items', [
                        { product_id: '', quantity: 1, container_borrowed_qty: 0 },
                    ]);
                },
            });
    };

    const submitExpense = (event) => {
        event.preventDefault();
        expenseForm
            .transform((data) => ({
                ...data,
                amount: Number(data.amount || 0),
            }))
            .post(route('expenses.store'), {
                preserveScroll: true,
                onSuccess: () => expenseForm.reset('description', 'amount'),
            });
    };

    const submitInventory = (event) => {
        event.preventDefault();
        inventoryForm
            .transform((data) => ({
                ...data,
                beginning_sacks: Number(data.beginning_sacks || 0),
                harvested_today: Number(data.harvested_today || 0),
                actual_ending_count: Number(data.actual_ending_count || 0),
            }))
            .post(route('inventory-counts.store'), {
                preserveScroll: true,
            });
    };

    const submitCollection = (event) => {
        event.preventDefault();
        collectionForm
            .transform((data) => ({
                ...data,
                customer_id: data.customer_id ? Number(data.customer_id) : null,
                amount: Number(data.amount || 0),
            }))
            .post(route('collections.store'), {
                preserveScroll: true,
                onSuccess: () => collectionForm.reset('amount', 'notes'),
            });
    };

    const submitWaterRestock = (event) => {
        event.preventDefault();
        waterRestockForm
            .transform((data) => ({
                ...data,
                quantity: Number(data.quantity || 0),
            }))
            .post(route('water-restocks.store'), {
                preserveScroll: true,
                onSuccess: () => waterRestockForm.reset('quantity', 'notes'),
            });
    };

    const submitContainerReturn = (event) => {
        event.preventDefault();
        containerReturnForm
            .transform((data) => ({
                ...data,
                customer_id: data.customer_id ? Number(data.customer_id) : null,
                quantity: Number(data.quantity || 0),
            }))
            .post(route('records.container-return'), {
                preserveScroll: true,
                onSuccess: () => containerReturnForm.reset('quantity', 'notes'),
            });
    };

    const submitPayroll = (event) => {
        event.preventDefault();
        payrollForm
            .transform((data) => ({
                ...data,
                employee_id: data.employee_id ? Number(data.employee_id) : null,
                lunch_break_minutes: Number(data.lunch_break_minutes || 0),
                amount: Number(data.amount || 0),
            }))
            .post(route('payroll.store'), {
                preserveScroll: true,
                onSuccess: () => payrollForm.reset('amount', 'notes', 'actual_in', 'actual_out'),
            });
    };

    const loadHistory = () => {
        router.reload({
            only: ['history', 'historyDate'],
            data: { date: historyDate },
        });
    };

    const loadPayroll = () => {
        router.reload({
            only: ['payrollToday', 'payrollDate'],
            data: { payroll_date: payrollDate },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-900">Clear Ice POS</h2>}
        >
            <Head title="Dashboard" />

            <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
                {(flash?.success || flash?.error) && (
                    <div
                        className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                            flash?.success
                                ? 'border-green-300 bg-green-50 text-green-800'
                                : 'border-red-300 bg-red-50 text-red-800'
                        }`}
                    >
                        {flash?.success || flash?.error}
                    </div>
                )}

                <div className="mb-4 overflow-x-auto rounded-md border border-gray-200 bg-white p-2">
                    <div className="flex min-w-max gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-md px-4 py-2 text-sm font-medium ${
                                    activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'Sales' && (
                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">Sales Transaction</h3>
                        <form onSubmit={submitSale} className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <Input
                                    label="Sale Date"
                                    type="date"
                                    value={salesForm.data.sale_date}
                                    onChange={(value) => salesForm.setData('sale_date', value)}
                                />
                                <Select
                                    label="Customer"
                                    value={salesForm.data.customer_id}
                                    onChange={(value) => salesForm.setData('customer_id', value)}
                                    options={customers.map((customer) => ({
                                        value: customer.id,
                                        label: customer.name,
                                    }))}
                                    placeholder="Select customer"
                                />
                                <Input
                                    label="Delivered By"
                                    value={salesForm.data.delivered_by}
                                    onChange={(value) => salesForm.setData('delivered_by', value)}
                                />
                            </div>

                            <div className="space-y-2">
                                {salesForm.data.items.map((item, index) => {
                                    const product = productsById[item.product_id];
                                    const lineTotal = product
                                        ? Number(product.price || 0) * Number(item.quantity || 0)
                                        : 0;

                                    return (
                                        <div
                                            key={`sale-item-${index}`}
                                            className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 p-3 md:grid-cols-12"
                                        >
                                            <div className="md:col-span-5">
                                                <Select
                                                    label="Product"
                                                    value={item.product_id}
                                                    onChange={(value) =>
                                                        updateSaleItem(index, 'product_id', Number(value))
                                                    }
                                                    options={products.map((productOption) => ({
                                                        value: productOption.id,
                                                        label: `${productOption.name} (${money(productOption.price)})`,
                                                    }))}
                                                    placeholder="Select product"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input
                                                    label="Qty"
                                                    type="number"
                                                    step="0.01"
                                                    value={item.quantity}
                                                    onChange={(value) => updateSaleItem(index, 'quantity', value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input
                                                    label="Borrowed Container"
                                                    type="number"
                                                    value={item.container_borrowed_qty}
                                                    onChange={(value) =>
                                                        updateSaleItem(index, 'container_borrowed_qty', value)
                                                    }
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input label="Line Total" value={money(lineTotal)} readOnly />
                                            </div>
                                            <div className="md:col-span-1 md:self-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSaleItem(index)}
                                                    className="w-full rounded-md border border-red-300 px-2 py-2 text-sm text-red-700 hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={addSaleItem}
                                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <FiPlus /> Add Item
                            </button>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                <Select
                                    label="Payment Method"
                                    value={salesForm.data.payment_method}
                                    onChange={(value) => salesForm.setData('payment_method', value)}
                                    options={[
                                        { value: 'cash', label: 'Cash' },
                                        { value: 'gcash', label: 'GCash' },
                                        { value: 'credit', label: 'Credit' },
                                        { value: 'partial', label: 'Partial' },
                                    ]}
                                />
                                <Input
                                    label="Cash Amount"
                                    type="number"
                                    step="0.01"
                                    value={salesForm.data.cash_amount}
                                    onChange={(value) => salesForm.setData('cash_amount', value)}
                                />
                                <Input
                                    label="GCash Amount"
                                    type="number"
                                    step="0.01"
                                    value={salesForm.data.gcash_amount}
                                    onChange={(value) => salesForm.setData('gcash_amount', value)}
                                />
                                <Input label="Total" value={money(saleTotal)} readOnly />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={salesForm.data.notes}
                                    onChange={(event) => salesForm.setData('notes', event.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    rows={2}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={salesForm.processing}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                FINALIZE SALE
                            </button>
                        </form>
                    </section>
                )}

                {activeTab === 'Inventory' && (
                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">Daily Ice Variance</h3>
                        <div className="mb-4 inline-flex rounded-md border border-gray-200 p-1">
                            <button
                                type="button"
                                onClick={() => setInventoryMode('daily')}
                                className={`rounded-md px-3 py-1 text-sm ${inventoryMode === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Daily Ice Variance
                            </button>
                            <button
                                type="button"
                                onClick={() => setInventoryMode('water')}
                                className={`rounded-md px-3 py-1 text-sm ${inventoryMode === 'water' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Water Restock
                            </button>
                        </div>

                        {inventoryMode === 'daily' ? (
                            <>
                                <form onSubmit={submitInventory} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <Input
                                        label="Count Date"
                                        type="date"
                                        value={inventoryForm.data.count_date}
                                        onChange={(value) => inventoryForm.setData('count_date', value)}
                                    />
                                    <Select
                                        label="Ice Size"
                                        value={inventoryForm.data.ice_size}
                                        onChange={(value) => inventoryForm.setData('ice_size', value)}
                                        options={[
                                            { value: '28mm', label: '28mm (Tube)' },
                                            { value: '35mm', label: '35mm (Tube)' },
                                        ]}
                                    />
                                    <Input
                                        label="Beginning Sacks"
                                        type="number"
                                        step="0.01"
                                        value={inventoryForm.data.beginning_sacks}
                                        onChange={(value) => inventoryForm.setData('beginning_sacks', value)}
                                    />
                                    <Input
                                        label="Harvested Today"
                                        type="number"
                                        step="0.01"
                                        value={inventoryForm.data.harvested_today}
                                        onChange={(value) => inventoryForm.setData('harvested_today', value)}
                                    />
                                    <Input
                                        label="Actual Ending Count"
                                        type="number"
                                        step="0.01"
                                        value={inventoryForm.data.actual_ending_count}
                                        onChange={(value) =>
                                            inventoryForm.setData('actual_ending_count', value)
                                        }
                                    />
                                    <Input
                                        label="Notes"
                                        value={inventoryForm.data.notes}
                                        onChange={(value) => inventoryForm.setData('notes', value)}
                                    />
                                    <div className="md:col-span-3">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            CALC VARIANCE & SAVE
                                        </button>
                                    </div>
                                </form>

                                <table className="mt-4 w-full table-auto border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-gray-700">
                                            <th className="px-3 py-2">Ice Size</th>
                                            <th className="px-3 py-2">Expected</th>
                                            <th className="px-3 py-2">Actual</th>
                                            <th className="px-3 py-2">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryToday.map((row) => (
                                            <tr key={row.id} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{row.ice_size}</td>
                                                <td className="px-3 py-2">{row.expected_count}</td>
                                                <td className="px-3 py-2">{row.actual_ending_count}</td>
                                                <td
                                                    className={`px-3 py-2 ${
                                                        Number(row.variance) > 0
                                                            ? 'text-red-700'
                                                            : 'text-green-700'
                                                    }`}
                                                >
                                                    {row.variance}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <>
                                <form onSubmit={submitWaterRestock} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <Input
                                        label="Restock Date"
                                        type="date"
                                        value={waterRestockForm.data.restock_date}
                                        onChange={(value) =>
                                            waterRestockForm.setData('restock_date', value)
                                        }
                                    />
                                    <Input
                                        label="Item Name"
                                        value={waterRestockForm.data.item_name}
                                        onChange={(value) =>
                                            waterRestockForm.setData('item_name', value)
                                        }
                                    />
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        step="0.01"
                                        value={waterRestockForm.data.quantity}
                                        onChange={(value) =>
                                            waterRestockForm.setData('quantity', value)
                                        }
                                    />
                                    <Input
                                        label="Unit"
                                        value={waterRestockForm.data.unit}
                                        onChange={(value) => waterRestockForm.setData('unit', value)}
                                    />
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Notes"
                                            value={waterRestockForm.data.notes}
                                            onChange={(value) => waterRestockForm.setData('notes', value)}
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            SAVE WATER RESTOCK
                                        </button>
                                    </div>
                                </form>

                                <DataTable
                                    title="Water Restocks Today"
                                    icon={<FiBox />}
                                    headers={['Date', 'Item', 'Qty', 'Unit']}
                                    rows={waterRestocksToday.map((row) => [
                                        row.restock_date,
                                        row.item_name,
                                        row.quantity,
                                        row.unit,
                                    ])}
                                />
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'Expenses' && (
                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">Log Expense</h3>
                        <form onSubmit={submitExpense} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Input
                                label="Expense Date"
                                type="date"
                                value={expenseForm.data.expense_date}
                                onChange={(value) => expenseForm.setData('expense_date', value)}
                            />
                            <Select
                                label="Type"
                                value={expenseForm.data.transaction_type}
                                onChange={(value) => expenseForm.setData('transaction_type', value)}
                                options={[
                                    { value: 'regular', label: 'Regular Expense' },
                                    { value: 'cash_advance', label: 'Cash Advance' },
                                    { value: 'salary', label: 'Salary Payment' },
                                ]}
                            />
                            <Select
                                label="Payment Source"
                                value={expenseForm.data.payment_source}
                                onChange={(value) => expenseForm.setData('payment_source', value)}
                                options={[
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'gcash', label: 'GCash' },
                                ]}
                            />
                            <Input
                                label="Category"
                                value={expenseForm.data.category}
                                onChange={(value) => expenseForm.setData('category', value)}
                            />
                            <Input
                                label="Description"
                                value={expenseForm.data.description}
                                onChange={(value) => expenseForm.setData('description', value)}
                            />
                            <Input
                                label="Amount"
                                type="number"
                                step="0.01"
                                value={expenseForm.data.amount}
                                onChange={(value) => expenseForm.setData('amount', value)}
                            />
                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    SAVE EXPENSE
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {activeTab === 'Records' && (
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
                            <DataTable
                                title="Unpaid Balances"
                                icon={<FiList />}
                                headers={['Customer', 'Outstanding']}
                                rows={unpaidBalances.map((row) => [
                                    row.customer?.name ?? 'Unknown',
                                    money(row.outstanding),
                                ])}
                            />
                            <DataTable
                                title="Borrowed Containers"
                                icon={<FiBox />}
                                headers={['Customer', 'Container', 'Outstanding']}
                                rows={borrowedContainers.map((row) => [
                                    row.customer?.name ?? 'Unknown',
                                    row.container_type,
                                    row.outstanding,
                                ])}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'History' && (
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
                                        <th className="px-3 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((row) => (
                                        <tr key={row.id} className="border-t border-gray-200">
                                            <td className="px-3 py-2">{row.sale_date}</td>
                                            <td className="px-3 py-2">{row.customer?.name ?? 'Walk-in'}</td>
                                            <td className="px-3 py-2 uppercase">{row.payment_method}</td>
                                            <td className="px-3 py-2">{money(row.total_amount)}</td>
                                            <td className="px-3 py-2">
                                                {row.status !== 'void' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.patch(
                                                                route('sales.void', row.id),
                                                                {},
                                                                { preserveScroll: true },
                                                            )
                                                        }
                                                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                                    >
                                                        Void
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-500">Voided</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'Dashboard' && (
                    <section className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <SummaryCard icon={<FiDollarSign />} title="Total Sales" value={money(totals.sales)} />
                            <SummaryCard icon={<FiMinusCircle />} title="Total Expense" value={money(totals.expenses)} />
                            <SummaryCard icon={<FiCreditCard />} title="Outstanding Debt" value={money(outstandingDebt)} />
                            <SummaryCard icon={<FiTrendingUp />} title="Net" value={money(Number(totals.sales || 0) - Number(totals.expenses || 0))} />
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
                )}

                {activeTab === 'Z-Read' && (
                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">End of Day Report (Z-Read)</h3>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <SummaryCard icon={<FiDollarSign />} title="Current Cash Sales" value={money(totals.cash_sales)} />
                            <SummaryCard icon={<FiCreditCard />} title="GCash Sales" value={money(totals.gcash_sales)} />
                            <SummaryCard icon={<FiList />} title="Unpaid / Credit" value={money(totals.credit_sales)} />
                            <SummaryCard icon={<FiPlus />} title="Collections (Cash)" value={money(totals.collections_cash)} />
                            <SummaryCard icon={<FiCreditCard />} title="Collections (GCash)" value={money(totals.collections_gcash)} />
                            <SummaryCard icon={<FiMinusCircle />} title="Less: Expenses" value={money(totals.expenses)} />
                        </div>

                        <div className="mt-4 rounded-md border border-gray-200 p-4">
                            <div className="mb-2 flex items-center justify-between text-base font-semibold text-gray-900">
                                <span>Cash To Remit</span>
                                <span>{money(totals.cash_to_remit)}</span>
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
                )}

                {activeTab === 'Payroll' && (
                    <section className="space-y-4">
                        <div className="rounded-md border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Admin Payroll Portal</h3>
                            <form onSubmit={submitPayroll} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <Input
                                    label="Date"
                                    type="date"
                                    value={payrollForm.data.entry_date}
                                    onChange={(value) => payrollForm.setData('entry_date', value)}
                                />
                                <Select
                                    label="Employee"
                                    value={payrollForm.data.employee_id}
                                    onChange={(value) => payrollForm.setData('employee_id', value)}
                                    options={employees.map((employee) => ({
                                        value: employee.id,
                                        label: employee.name,
                                    }))}
                                    placeholder="Select employee"
                                />
                                <Select
                                    label="Entry Type"
                                    value={payrollForm.data.entry_type}
                                    onChange={(value) => payrollForm.setData('entry_type', value)}
                                    options={[
                                        { value: 'time_log', label: 'Time Log' },
                                        { value: 'cash_advance', label: 'Cash Advance' },
                                        { value: 'salary_payment', label: 'Salary Payment' },
                                    ]}
                                />

                                {payrollForm.data.entry_type === 'time_log' && (
                                    <>
                                        <Input
                                            label="Shift Length"
                                            value={payrollForm.data.shift_length}
                                            onChange={(value) => payrollForm.setData('shift_length', value)}
                                        />
                                        <Input
                                            label="Expected Schedule IN"
                                            type="time"
                                            value={payrollForm.data.expected_in}
                                            onChange={(value) => payrollForm.setData('expected_in', value)}
                                        />
                                        <Input
                                            label="Actual Clock IN"
                                            type="time"
                                            value={payrollForm.data.actual_in}
                                            onChange={(value) => payrollForm.setData('actual_in', value)}
                                        />
                                        <Input
                                            label="Actual Clock OUT"
                                            type="time"
                                            value={payrollForm.data.actual_out}
                                            onChange={(value) => payrollForm.setData('actual_out', value)}
                                        />
                                        <Input
                                            label="Lunch Break (minutes)"
                                            type="number"
                                            value={payrollForm.data.lunch_break_minutes}
                                            onChange={(value) =>
                                                payrollForm.setData('lunch_break_minutes', value)
                                            }
                                        />
                                    </>
                                )}

                                {(payrollForm.data.entry_type === 'cash_advance' ||
                                    payrollForm.data.entry_type === 'salary_payment') && (
                                    <Input
                                        label="Amount"
                                        type="number"
                                        step="0.01"
                                        value={payrollForm.data.amount}
                                        onChange={(value) => payrollForm.setData('amount', value)}
                                    />
                                )}

                                <div className="md:col-span-3">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        value={payrollForm.data.notes}
                                        onChange={(event) =>
                                            payrollForm.setData('notes', event.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        rows={2}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        SAVE PAYROLL ENTRY
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-md border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex flex-wrap items-end gap-3">
                                <Input
                                    label="Payroll Date"
                                    type="date"
                                    value={payrollDate}
                                    onChange={setPayrollDate}
                                />
                                <button
                                    type="button"
                                    onClick={loadPayroll}
                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <FiRefreshCw /> View
                                </button>
                            </div>

                            <DataTable
                                title="Payroll Entries"
                                icon={<FiUsers />}
                                headers={['Employee', 'Type', 'Amount', 'Date']}
                                rows={payrollToday.map((row) => [
                                    row.employee?.name ?? 'N/A',
                                    row.entry_type,
                                    money(row.amount),
                                    row.entry_date,
                                ])}
                            />
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ icon, title, value }) {
    return (
        <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                {icon} {title}
            </div>
            <div className="text-lg font-semibold text-gray-900">{value}</div>
        </div>
    );
}

function Input({ label, onChange, readOnly = false, ...props }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
                {...props}
                readOnly={readOnly}
                onChange={(event) => onChange?.(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
            />
        </div>
    );
}

function Select({ label, value, onChange, options, placeholder }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
            >
                {placeholder ? <option value="">{placeholder}</option> : null}
                {options.map((option) => (
                    <option key={`${option.value}-${option.label}`} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function DataTable({ title, icon, headers, rows }) {
    return (
        <div className="rounded-md border border-gray-200 bg-white p-4">
            <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                {icon} {title}
            </h4>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            {headers.map((header) => (
                                <th key={header} className="px-3 py-2">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-3 py-4 text-center text-gray-500">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={`${title}-row-${index}`} className="border-t border-gray-200">
                                    {row.map((value, idx) => (
                                        <td key={`${title}-cell-${index}-${idx}`} className="px-3 py-2">
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
