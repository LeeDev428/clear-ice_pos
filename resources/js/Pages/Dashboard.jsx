import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    FiBox,
    FiCheck,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiEdit2,
    FiFileText,
    FiList,
    FiMinusCircle,
    FiPercent,
    FiPlus,
    FiPrinter,
    FiRefreshCw,
    FiSearch,
    FiSettings,
    FiTruck,
    FiTrendingUp,
    FiUsers,
    FiX,
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
    zreadDate: zreadDateProp,
    dashboardDate: dashboardDateProp,
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
    expensesToday,
    salesTrend,
    topProducts,
    totals,
    zreadTotals,
    dashboardTotals,
    cashAdvances,
    periodTimeLogs,
    periodEmployee: periodEmployeeProp,
    periodStart: periodStartProp,
    periodEnd: periodEndProp,
}) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('Sales');
    const [historyDate, setHistoryDate] = useState(historyDateProp || today);
    const [payrollDate, setPayrollDate] = useState(payrollDateProp || today);
    const [zreadDate, setZreadDate] = useState(zreadDateProp || today);
    const [dashboardDate, setDashboardDate] = useState(dashboardDateProp || today);
    const [actualCashRemitted, setActualCashRemitted] = useState('');
    const [inventoryMode, setInventoryMode] = useState('daily');
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [voidTarget, setVoidTarget] = useState(null);
    const [voidReason, setVoidReason] = useState('');
    const [showEditSaleModal, setShowEditSaleModal] = useState(false);
    const [editSaleTarget, setEditSaleTarget] = useState(null);
    const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
    const [editExpenseTarget, setEditExpenseTarget] = useState(null);
    const [recordsSearch, setRecordsSearch] = useState('');
    const [containerSearch, setContainerSearch] = useState('');
    const [showPrintReceipt, setShowPrintReceipt] = useState(false);
    const [lastSaleData, setLastSaleData] = useState(null);
    // NEW state
    const [payrollSubTab, setPayrollSubTab] = useState('time_logs');
    const [showProductModal, setShowProductModal] = useState(false);
    const [editProductTarget, setEditProductTarget] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [posQty, setPosQty] = useState(1);
    const [posDiscount, setPosDiscount] = useState(0);
    const [posBorrowedQty, setPosBorrowedQty] = useState(0);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [editEmployeeTarget, setEditEmployeeTarget] = useState(null);
    const [showViewReceiptModal, setShowViewReceiptModal] = useState(false);
    const [viewReceiptSale, setViewReceiptSale] = useState(null);
    const [periodEmployee, setPeriodEmployee] = useState(periodEmployeeProp || '');
    const [periodStart, setPeriodStart] = useState(periodStartProp || '');
    const [periodEnd, setPeriodEnd] = useState(periodEndProp || '');
    const [periodPaymentDate, setPeriodPaymentDate] = useState(today);
    const [deductSSS, setDeductSSS] = useState(true);
    const [deductPH, setDeductPH] = useState(true);
    const [deductHDMF, setDeductHDMF] = useState(true);
    const [caDeducted, setCaDeducted] = useState(0);

    const salesForm = useForm({
        sale_date: today,
        customer_id: '',
        delivered_by: '',
        payment_method: 'cash',
        cash_amount: 0,
        gcash_amount: 0,
        notes: '',
        items: [{ product_id: '', quantity: 1, container_borrowed_qty: 0, discount: 0, container_type: '' }],
    });

    const expenseForm = useForm({
        expense_date: today,
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
        deduction_type: '',
        shift_length: 'Full Day (100% Rate)',
        shift_type: 'full_day',
        expected_in: '',
        actual_in: '',
        actual_out: '',
        lunch_break_minutes: 0,
        ot_hours: 0,
        ot_rate: 0,
        ot_approved: false,
        amount: '',
        bonus: 0,
        notes: '',
    });

    const productForm = useForm({
        name: '',
        category: 'ice',
        price: '',
        ice_size: '',
        container_type: '',
        is_returnable: false,
        track_inventory: true,
    });

    const employeeForm = useForm({
        name: '',
        role: '',
        employee_type: 'regular',
        daily_rate: '',
        ot_rate: '',
        late_rate: '',
        sss_contribution: 0,
        philhealth_contribution: 0,
        pagibig_contribution: 0,
    });

    const cashAdvanceForm = useForm({
        employee_id: '',
        advance_date: today,
        amount: '',
        notes: '',
    });

    const payrollFinalizeForm = useForm({
        employee_id: '',
        payment_date: today,
        start_date: '',
        end_date: '',
        net_pay: '',
        ca_deducted: 0,
        notes: '',
    });

    const editSaleForm = useForm({
        sale_date: '',
        customer_id: '',
        delivered_by: '',
        payment_method: 'cash',
        cash_amount: 0,
        gcash_amount: 0,
        notes: '',
    });

    const editExpenseForm = useForm({
        category: '',
        description: '',
        amount: '',
        payment_source: 'cash',
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
            const subtotal = Number(item.quantity || 0) * Number(product.price || 0);
            const discount = Number(item.discount || 0);
            return sum + Math.max(0, subtotal - discount);
        }, 0);
    }, [productsById, salesForm.data.items]);

    const outstandingDebt = useMemo(() => {
        return unpaidBalances.reduce((sum, row) => sum + Number(row.outstanding || 0), 0);
    }, [unpaidBalances]);

    const zReadVariance = useMemo(() => {
        const actual = Number(actualCashRemitted || 0);

        return Number(zreadTotals?.cash_to_remit || 0) - actual;
    }, [actualCashRemitted, zreadTotals]);

    const selectedPeriodEmployee = useMemo(() => {
        if (!periodEmployee) return null;
        return employees.find((e) => String(e.id) === String(periodEmployee)) || null;
    }, [employees, periodEmployee]);

    const payrollPreview = useMemo(() => {
        if (!periodTimeLogs || periodTimeLogs.length === 0 || !selectedPeriodEmployee) return null;
        const emp = selectedPeriodEmployee;
        let grossPay = 0;
        let totalLateDeduction = 0;
        let totalOtEarned = 0;
        let totalBonus = 0;
        let fullDays = 0;
        let halfDays = 0;
        const rows = periodTimeLogs.map((log) => {
            const isHalf = log.shift_type === 'half_day';
            const dayEarned = isHalf ? (Number(emp.daily_rate) / 2) : Number(emp.daily_rate);
            const otEarned = Number(log.ot_hours || 0) * Number(emp.ot_rate || 0);
            const bonus = Number(log.bonus || 0);
            const late = Number(log.late_deduction || 0);
            const earned = dayEarned + otEarned + bonus - late;
            grossPay += earned;
            totalLateDeduction += late;
            totalOtEarned += otEarned;
            totalBonus += bonus;
            if (isHalf) halfDays++; else fullDays++;
            return { log, dayEarned, otEarned, bonus, late, earned, isHalf };
        });
        const sss = deductSSS ? Number(emp.sss_contribution || 0) : 0;
        const ph = deductPH ? Number(emp.philhealth_contribution || 0) : 0;
        const hdmf = deductHDMF ? Number(emp.pagibig_contribution || 0) : 0;
        const ca = Number(caDeducted || 0);
        const totalDeductions = sss + ph + hdmf + ca + totalLateDeduction;
        const netPay = Math.max(0, grossPay - totalDeductions);
        return { rows, grossPay, totalLateDeduction, totalOtEarned, totalBonus, fullDays, halfDays, sss, ph, hdmf, ca, totalDeductions, netPay };
    }, [periodTimeLogs, selectedPeriodEmployee, deductSSS, deductPH, deductHDMF, caDeducted]);

    const addSaleItem = () => {
        salesForm.setData('items', [
            ...salesForm.data.items,
            { product_id: '', quantity: 1, container_borrowed_qty: 0, discount: 0, container_type: '' },
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
        const itemsSnapshot = salesForm.data.items.filter((item) => item.product_id);
        const customerSnapshot = salesForm.data.customer_id;
        const methodSnapshot = salesForm.data.payment_method;
        salesForm.transform((data) => ({
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
                    discount: Number(item.discount || 0),
                    container_type: item.container_type || null,
                })),
        }));

        salesForm.post(route('sales.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const customer = customers.find((c) => String(c.id) === String(customerSnapshot));
                setLastSaleData({
                    items: itemsSnapshot,
                    total: saleTotal,
                    customer: customer?.name || 'Walk-in',
                    payment_method: methodSnapshot,
                    date: salesForm.data.sale_date,
                });
                setShowPrintReceipt(true);
                salesForm.reset('delivered_by', 'cash_amount', 'gcash_amount', 'notes');
                salesForm.setData('items', [
                    { product_id: '', quantity: 1, container_borrowed_qty: 0, discount: 0, container_type: '' },
                ]);
            },
        });
    };

    const submitExpense = (event) => {
        event.preventDefault();
        expenseForm.transform((data) => ({
            ...data,
            amount: Number(data.amount || 0),
        }));

        expenseForm.post(route('expenses.store'), {
            preserveScroll: true,
            onSuccess: () => expenseForm.reset('description', 'amount'),
        });
    };

    const submitInventory = (event) => {
        event.preventDefault();
        inventoryForm.transform((data) => ({
            ...data,
            beginning_sacks: Number(data.beginning_sacks || 0),
            harvested_today: Number(data.harvested_today || 0),
            actual_ending_count: Number(data.actual_ending_count || 0),
        }));

        inventoryForm.post(route('inventory-counts.store'), {
            preserveScroll: true,
        });
    };

    const submitCollection = (event) => {
        event.preventDefault();
        collectionForm.transform((data) => ({
            ...data,
            customer_id: data.customer_id ? Number(data.customer_id) : null,
            amount: Number(data.amount || 0),
        }));

        collectionForm.post(route('collections.store'), {
            preserveScroll: true,
            onSuccess: () => collectionForm.reset('amount', 'notes'),
        });
    };

    const submitWaterRestock = (event) => {
        event.preventDefault();
        waterRestockForm.transform((data) => ({
            ...data,
            quantity: Number(data.quantity || 0),
        }));

        waterRestockForm.post(route('water-restocks.store'), {
            preserveScroll: true,
            onSuccess: () => waterRestockForm.reset('quantity', 'notes'),
        });
    };

    const submitContainerReturn = (event) => {
        event.preventDefault();
        containerReturnForm.transform((data) => ({
            ...data,
            customer_id: data.customer_id ? Number(data.customer_id) : null,
            quantity: Number(data.quantity || 0),
        }));

        containerReturnForm.post(route('records.container-return'), {
            preserveScroll: true,
            onSuccess: () => containerReturnForm.reset('quantity', 'notes'),
        });
    };

    const submitPayroll = (event) => {
        event.preventDefault();
        payrollForm.transform((data) => ({
            ...data,
            employee_id: data.employee_id ? Number(data.employee_id) : null,
            lunch_break_minutes: Number(data.lunch_break_minutes || 0),
            ot_hours: Number(data.ot_hours || 0),
            ot_rate: Number(data.ot_rate || 0),
            ot_approved: Boolean(data.ot_approved),
            amount: Number(data.amount || 0),
        }));

        payrollForm.post(route('payroll.store'), {
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

    const loadZread = () => {
        router.reload({
            only: ['zreadTotals', 'zreadDate'],
            data: { zread_date: zreadDate },
        });
    };

    const loadDashboard = () => {
        router.reload({
            only: ['dashboardTotals', 'dashboardDate'],
            data: { dashboard_date: dashboardDate },
        });
    };

    const openVoidModal = (sale) => {
        setVoidTarget(sale);
        setVoidReason('');
        setShowVoidModal(true);
    };

    const confirmVoid = () => {
        if (!voidReason.trim()) return;
        router.patch(
            route('sales.void', voidTarget.id),
            { void_reason: voidReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowVoidModal(false);
                    setVoidTarget(null);
                    setVoidReason('');
                },
            },
        );
    };

    const openEditSaleModal = (sale) => {
        setEditSaleTarget(sale);
        editSaleForm.setData({
            sale_date: sale.sale_date || today,
            customer_id: sale.customer_id || '',
            delivered_by: sale.delivered_by || '',
            payment_method: sale.payment_method || 'cash',
            cash_amount: sale.cash_amount || 0,
            gcash_amount: sale.gcash_amount || 0,
            notes: sale.notes || '',
        });
        setShowEditSaleModal(true);
    };

    const submitEditSale = (event) => {
        event.preventDefault();
        editSaleForm.patch(route('sales.update', editSaleTarget.id), {
            preserveScroll: true,
            onSuccess: () => setShowEditSaleModal(false),
        });
    };

    const openEditExpenseModal = (expense) => {
        setEditExpenseTarget(expense);
        editExpenseForm.setData({
            category: expense.category || '',
            description: expense.description || '',
            amount: expense.amount || '',
            payment_source: expense.payment_source || 'cash',
        });
        setShowEditExpenseModal(true);
    };

    const submitEditExpense = (event) => {
        event.preventDefault();
        editExpenseForm.patch(route('expenses.update', editExpenseTarget.id), {
            preserveScroll: true,
            onSuccess: () => setShowEditExpenseModal(false),
        });
    };

    const deleteExpense = (expense) => {
        if (!confirm(`Delete expense: ${expense.description} (${money(expense.amount)})?`)) return;
        router.delete(route('expenses.destroy', expense.id), { preserveScroll: true });
    };

    // POS helpers
    const addToCart = () => {
        if (!selectedProduct) return;
        const existing = salesForm.data.items.find((i) => i.product_id === selectedProduct.id);
        if (existing) {
            salesForm.setData('items', salesForm.data.items.map((i) =>
                i.product_id === selectedProduct.id
                    ? { ...i, quantity: Number(i.quantity) + Number(posQty) }
                    : i
            ));
        } else {
            const newItems = salesForm.data.items.filter((i) => i.product_id !== '');
            salesForm.setData('items', [
                ...newItems,
                {
                    product_id: selectedProduct.id,
                    quantity: Number(posQty),
                    discount: Number(posDiscount),
                    container_borrowed_qty: Number(posBorrowedQty),
                    container_type: '',
                },
            ]);
        }
        setSelectedProduct(null);
        setPosQty(1);
        setPosDiscount(0);
        setPosBorrowedQty(0);
    };

    // Product CRUD
    const openAddProduct = () => {
        setEditProductTarget(null);
        productForm.reset();
        setShowProductModal(true);
    };
    const openEditProduct = (product) => {
        setEditProductTarget(product);
        productForm.setData({
            name: product.name || '',
            category: product.category || 'ice',
            price: product.price || '',
            ice_size: product.ice_size || '',
            container_type: product.container_type || '',
            is_returnable: !!product.is_returnable,
            track_inventory: product.track_inventory !== false,
        });
        setShowProductModal(true);
    };
    const submitProduct = (event) => {
        event.preventDefault();
        if (editProductTarget) {
            productForm.patch(route('products.update', editProductTarget.id), {
                preserveScroll: true,
                onSuccess: () => setShowProductModal(false),
            });
        } else {
            productForm.post(route('products.store'), {
                preserveScroll: true,
                onSuccess: () => setShowProductModal(false),
            });
        }
    };

    // Employee CRUD
    const openAddEmployee = () => {
        setEditEmployeeTarget(null);
        employeeForm.reset();
        setShowEmployeeModal(true);
    };
    const openEditEmployee = (emp) => {
        setEditEmployeeTarget(emp);
        employeeForm.setData({
            name: emp.name || '',
            role: emp.role || '',
            employee_type: emp.employee_type || 'regular',
            daily_rate: emp.daily_rate || '',
            ot_rate: emp.ot_rate || '',
            late_rate: emp.late_rate || '',
            sss_contribution: emp.sss_contribution || 0,
            philhealth_contribution: emp.philhealth_contribution || 0,
            pagibig_contribution: emp.pagibig_contribution || 0,
        });
        setShowEmployeeModal(true);
    };
    const submitEmployee = (event) => {
        event.preventDefault();
        if (editEmployeeTarget) {
            employeeForm.patch(route('employees.update', editEmployeeTarget.id), {
                preserveScroll: true,
                onSuccess: () => setShowEmployeeModal(false),
            });
        } else {
            employeeForm.post(route('employees.store'), {
                preserveScroll: true,
                onSuccess: () => setShowEmployeeModal(false),
            });
        }
    };
    const deactivateEmployee = (emp) => {
        if (!confirm(`Deactivate ${emp.name}?`)) return;
        router.delete(route('employees.destroy', emp.id), { preserveScroll: true });
    };

    // Cash advance
    const submitCashAdvance = (event) => {
        event.preventDefault();
        cashAdvanceForm.post(route('cash-advances.store'), {
            preserveScroll: true,
            onSuccess: () => cashAdvanceForm.reset('amount', 'notes'),
        });
    };

    // Payroll finalize
    const submitFinalizePayroll = () => {
        if (!payrollPreview || !periodEmployee || !periodStart || !periodEnd) return;
        router.post(route('payroll.finalize'), {
            employee_id: periodEmployee,
            payment_date: periodPaymentDate,
            start_date: periodStart,
            end_date: periodEnd,
            net_pay: payrollPreview.netPay,
            ca_deducted: caDeducted,
        }, { preserveScroll: true });
    };

    const loadPeriodLogs = () => {
        if (!periodEmployee || !periodStart || !periodEnd) return;
        router.reload({
            only: ['periodTimeLogs', 'periodEmployee', 'periodStart', 'periodEnd'],
            data: {
                period_employee: periodEmployee,
                period_start: periodStart,
                period_end: periodEnd,
            },
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
                                            <th className="px-3 py-2">Harvested</th>
                                            <th className="px-3 py-2">Sold</th>
                                            <th className="px-3 py-2">Expected</th>
                                            <th className="px-3 py-2">Actual</th>
                                            <th className="px-3 py-2">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryToday.map((row) => (
                                            <tr key={row.id} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{row.ice_size}</td>
                                                <td className="px-3 py-2">{row.harvested_today}</td>
                                                <td className="px-3 py-2">{row.sold_today}</td>
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
                    <section className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">Log Expense</h3>
                        <form onSubmit={submitExpense} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Input
                                label="Expense Date"
                                type="date"
                                value={expenseForm.data.expense_date}
                                onChange={(value) => expenseForm.setData('expense_date', value)}
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
                            <Select
                                label="Category"
                                value={expenseForm.data.category}
                                onChange={(value) => expenseForm.setData('category', value)}
                                options={[
                                    { value: 'Auto Repair', label: 'Auto Repair' },
                                    { value: 'Fuel', label: 'Fuel' },
                                    { value: 'Utilities', label: 'Utilities' },
                                    { value: 'Maintenance', label: 'Maintenance' },
                                    { value: 'Supplies', label: 'Supplies' },
                                    { value: 'Others', label: 'Others' },
                                ]}
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

                        <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-700">Today&apos;s Expenses</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-gray-700">
                                            <th className="px-3 py-2">Category</th>
                                            <th className="px-3 py-2">Description</th>
                                            <th className="px-3 py-2">Amount</th>
                                            <th className="px-3 py-2">Source</th>
                                            <th className="px-3 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(expensesToday || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">No expenses today</td>
                                            </tr>
                                        ) : (
                                            (expensesToday || []).map((expense) => (
                                                <tr key={expense.id} className="border-t border-gray-200">
                                                    <td className="px-3 py-2">{expense.category}</td>
                                                    <td className="px-3 py-2">{expense.description}</td>
                                                    <td className="px-3 py-2">{money(expense.amount)}</td>
                                                    <td className="px-3 py-2 uppercase">{expense.payment_source}</td>
                                                    <td className="px-3 py-2 flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditExpenseModal(expense)}
                                                            className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <FiEdit2 size={12} /> Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteExpense(expense)}
                                                            className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                                        >
                                                            <FiX size={12} /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                )}

                {activeTab === 'Dashboard' && (
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
                )}

                {activeTab === 'Z-Read' && (
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
                )}

                {activeTab === 'Payroll' && (
                    <section className="space-y-4">
                        {/* Sub-tab nav */}
                        <div className="flex gap-1 rounded-md border border-gray-200 bg-white p-2">
                            {[
                                { key: 'time_logs', label: 'Time Logs' },
                                { key: 'employees', label: 'Employees' },
                                { key: 'cash_advance', label: 'Cash Advance' },
                                { key: 'payroll_process', label: 'Payroll Process' },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setPayrollSubTab(key)}
                                    className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                                        payrollSubTab === key
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Time Logs */}
                        {payrollSubTab === 'time_logs' && (
                            <div className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                                <h4 className="font-semibold text-gray-800">Log Time Entry</h4>
                                <form onSubmit={submitPayroll} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <Input label="Date" type="date" value={payrollForm.data.entry_date} onChange={(v) => payrollForm.setData('entry_date', v)} />
                                    <Select
                                        label="Employee"
                                        value={payrollForm.data.employee_id}
                                        onChange={(v) => payrollForm.setData('employee_id', v)}
                                        options={employees.map((e) => ({ value: e.id, label: e.name }))}
                                        placeholder="Select employee"
                                    />
                                    <Select
                                        label="Shift Type"
                                        value={payrollForm.data.shift_type}
                                        onChange={(v) => payrollForm.setData('shift_type', v)}
                                        options={[
                                            { value: 'full_day', label: 'Full Day (100%)' },
                                            { value: 'half_day', label: 'Half Day (50%)' },
                                        ]}
                                    />
                                    <Input label="Expected IN" type="time" value={payrollForm.data.expected_in} onChange={(v) => payrollForm.setData('expected_in', v)} />
                                    <Input label="Actual IN" type="time" value={payrollForm.data.actual_in} onChange={(v) => payrollForm.setData('actual_in', v)} />
                                    <Input label="Actual OUT" type="time" value={payrollForm.data.actual_out} onChange={(v) => payrollForm.setData('actual_out', v)} />
                                    <Input label="Lunch Break (min)" type="number" value={payrollForm.data.lunch_break_minutes} onChange={(v) => payrollForm.setData('lunch_break_minutes', v)} />
                                    <Input label="Approved OT Hours" type="number" step="0.25" value={payrollForm.data.ot_hours} onChange={(v) => payrollForm.setData('ot_hours', v)} />
                                    <Input label="Daily Bonus" type="number" step="0.01" value={payrollForm.data.bonus} onChange={(v) => payrollForm.setData('bonus', v)} />
                                    <div className="md:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea value={payrollForm.data.notes} onChange={(e) => payrollForm.setData('notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" rows={2} />
                                    </div>
                                    <div className="md:col-span-3">
                                        <button type="submit" disabled={payrollForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">SAVE TIME LOG</button>
                                    </div>
                                </form>
                                <div className="mb-3 flex flex-wrap items-end gap-3">
                                    <Input label="Payroll Date" type="date" value={payrollDate} onChange={setPayrollDate} />
                                    <button type="button" onClick={loadPayroll} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <FiRefreshCw /> View
                                    </button>
                                </div>
                                <DataTable
                                    title="Time Log Entries"
                                    icon={<FiUsers />}
                                    headers={['Date', 'Employee', 'Shift', 'Exp IN', 'Act IN', 'OT', 'Bonus', 'Late Deduction']}
                                    rows={payrollToday.filter((r) => r.entry_type === 'time_log').map((row) => [
                                        row.entry_date,
                                        row.employee?.name ?? '-',
                                        row.shift_type === 'half_day' ? 'Half' : 'Full',
                                        row.expected_in ?? '-',
                                        row.actual_in ?? '-',
                                        row.ot_hours ?? 0,
                                        money(row.bonus ?? 0),
                                        money(row.late_deduction ?? 0),
                                    ])}
                                />
                            </div>
                        )}

                        {/* Employees */}
                        {payrollSubTab === 'employees' && (
                            <div className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">Employees</h4>
                                    <button type="button" onClick={openAddEmployee} className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
                                        <FiPlus /> Add Employee
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-700">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Type</th>
                                                <th className="px-3 py-2">Daily Rate</th>
                                                <th className="px-3 py-2">OT Rate</th>
                                                <th className="px-3 py-2">Late Rate</th>
                                                <th className="px-3 py-2">SSS</th>
                                                <th className="px-3 py-2">PhilHealth</th>
                                                <th className="px-3 py-2">Pag-IBIG</th>
                                                <th className="px-3 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((emp) => (
                                                <tr key={emp.id} className="border-t border-gray-200">
                                                    <td className="px-3 py-2 font-medium">{emp.name}</td>
                                                    <td className="px-3 py-2 capitalize">{emp.employee_type || 'regular'}</td>
                                                    <td className="px-3 py-2">{money(emp.daily_rate)}</td>
                                                    <td className="px-3 py-2">{money(emp.ot_rate)}</td>
                                                    <td className="px-3 py-2">{money(emp.late_rate)}</td>
                                                    <td className="px-3 py-2">{money(emp.sss_contribution)}</td>
                                                    <td className="px-3 py-2">{money(emp.philhealth_contribution)}</td>
                                                    <td className="px-3 py-2">{money(emp.pagibig_contribution)}</td>
                                                    <td className="px-3 py-2 flex gap-1 flex-wrap">
                                                        <button type="button" onClick={() => openEditEmployee(emp)} className="inline-flex items-center gap-1 rounded border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50">
                                                            <FiEdit2 size={10} /> Edit
                                                        </button>
                                                        <button type="button" onClick={() => deactivateEmployee(emp)} className="inline-flex items-center gap-1 rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50">
                                                            <FiX size={10} /> Deactivate
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Cash Advance */}
                        {payrollSubTab === 'cash_advance' && (
                            <div className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                                <h4 className="font-semibold text-gray-800">Record Cash Advance</h4>
                                <form onSubmit={submitCashAdvance} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <Input label="Date" type="date" value={cashAdvanceForm.data.advance_date} onChange={(v) => cashAdvanceForm.setData('advance_date', v)} />
                                    <Select
                                        label="Employee"
                                        value={cashAdvanceForm.data.employee_id}
                                        onChange={(v) => cashAdvanceForm.setData('employee_id', v)}
                                        options={employees.map((e) => ({ value: e.id, label: e.name }))}
                                        placeholder="Select employee"
                                    />
                                    <Input label="Amount" type="number" step="0.01" value={cashAdvanceForm.data.amount} onChange={(v) => cashAdvanceForm.setData('amount', v)} />
                                    <div className="md:col-span-2">
                                        <Input label="Notes" value={cashAdvanceForm.data.notes} onChange={(v) => cashAdvanceForm.setData('notes', v)} />
                                    </div>
                                    <div className="md:self-end">
                                        <button type="submit" disabled={cashAdvanceForm.processing} className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">RECORD ADVANCE</button>
                                    </div>
                                </form>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-700">
                                                <th className="px-3 py-2">Date</th>
                                                <th className="px-3 py-2">Employee</th>
                                                <th className="px-3 py-2">Amount</th>
                                                <th className="px-3 py-2">Balance</th>
                                                <th className="px-3 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(cashAdvances || []).length === 0 ? (
                                                <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400">No cash advances found</td></tr>
                                            ) : (
                                                (cashAdvances || []).map((ca) => (
                                                    <tr key={ca.id} className="border-t border-gray-200">
                                                        <td className="px-3 py-2">{ca.advance_date}</td>
                                                        <td className="px-3 py-2">{ca.employee?.name ?? '-'}</td>
                                                        <td className="px-3 py-2">{money(ca.amount)}</td>
                                                        <td className="px-3 py-2">{money(ca.balance)}</td>
                                                        <td className="px-3 py-2">
                                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ca.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                                {ca.status === 'paid' ? 'Paid' : 'Active'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Payroll Process */}
                        {payrollSubTab === 'payroll_process' && (
                            <div className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                                <h4 className="font-semibold text-gray-800">Payroll Process</h4>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <Select
                                        label="Employee"
                                        value={periodEmployee}
                                        onChange={setPeriodEmployee}
                                        options={employees.map((e) => ({ value: e.id, label: e.name }))}
                                        placeholder="Select employee"
                                    />
                                    <Input label="Start Date" type="date" value={periodStart} onChange={setPeriodStart} />
                                    <Input label="End Date" type="date" value={periodEnd} onChange={setPeriodEnd} />
                                    <Input label="Payment Date" type="date" value={periodPaymentDate} onChange={setPeriodPaymentDate} />
                                </div>
                                <button type="button" onClick={loadPeriodLogs} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">CALCULATE PAYROLL</button>

                                {payrollPreview && selectedPeriodEmployee && (
                                    <div className="space-y-3" id="payslip-print">
                                        <div className="rounded-md bg-gray-50 p-3 text-center print:block">
                                            <div className="text-lg font-bold">BALDEO | CLEAR ICE INC.</div>
                                            <div className="text-sm text-gray-600">Payslip: {periodStart} to {periodEnd}</div>
                                            <div className="text-sm text-gray-700">Employee: {selectedPeriodEmployee.name}</div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100 text-gray-700">
                                                        <th className="px-3 py-2 text-left">Date</th>
                                                        <th className="px-3 py-2 text-left">Shift</th>
                                                        <th className="px-3 py-2 text-right">Day Rate</th>
                                                        <th className="px-3 py-2 text-right">OT</th>
                                                        <th className="px-3 py-2 text-right">Bonus</th>
                                                        <th className="px-3 py-2 text-right">Late</th>
                                                        <th className="px-3 py-2 text-right">Earned</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payrollPreview.rows.map(({ log, dayEarned, otEarned, bonus, late, earned, isHalf }) => (
                                                        <tr key={log.id} className="border-t border-gray-200">
                                                            <td className="px-3 py-2">{log.entry_date}</td>
                                                            <td className="px-3 py-2">{isHalf ? 'Half' : 'Full'}</td>
                                                            <td className="px-3 py-2 text-right">{money(dayEarned)}</td>
                                                            <td className="px-3 py-2 text-right">{money(otEarned)}</td>
                                                            <td className="px-3 py-2 text-right">{money(bonus)}</td>
                                                            <td className="px-3 py-2 text-right text-red-600">({money(late)})</td>
                                                            <td className="px-3 py-2 text-right font-medium">{money(earned)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-600">CA Deduction</label>
                                                <input type="number" min="0" step="0.01" value={caDeducted} onChange={(e) => setCaDeducted(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                            </div>
                                            <div className="flex flex-col gap-2 pt-4">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" checked={deductSSS} onChange={(e) => setDeductSSS(e.target.checked)} /> SSS ({money(selectedPeriodEmployee.sss_contribution)})
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" checked={deductPH} onChange={(e) => setDeductPH(e.target.checked)} /> PhilHealth ({money(selectedPeriodEmployee.philhealth_contribution)})
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" checked={deductHDMF} onChange={(e) => setDeductHDMF(e.target.checked)} /> Pag-IBIG ({money(selectedPeriodEmployee.pagibig_contribution)})
                                                </label>
                                            </div>
                                            <div className="rounded-md bg-blue-50 p-3">
                                                <div className="text-xs text-gray-600">Gross Pay</div>
                                                <div className="font-bold text-gray-900">{money(payrollPreview.grossPay)}</div>
                                                <div className="mt-1 text-xs text-gray-500">SSS: {money(payrollPreview.sss)} | PH: {money(payrollPreview.ph)} | HDMF: {money(payrollPreview.hdmf)}</div>
                                                <div className="text-xs text-gray-500">CA: {money(payrollPreview.ca)} | Late: {money(payrollPreview.totalLateDeduction)}</div>
                                                <div className="mt-2 border-t pt-1 text-sm font-bold text-gray-600">Total Deductions: {money(payrollPreview.totalDeductions)}</div>
                                                <div className="text-xl font-bold text-blue-700">NET PAY: {money(payrollPreview.netPay)}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <FiPrinter /> Print Payslip
                                            </button>
                                            <button type="button" onClick={submitFinalizePayroll} className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                                                FINALIZE & RECORD SALARY
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* Void Modal */}
            {showVoidModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">Void Sale</h3>
                        <p className="mb-3 text-sm text-gray-600">
                            Please provide a reason for voiding this sale.
                        </p>
                        <textarea
                            value={voidReason}
                            onChange={(e) => setVoidReason(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Reason for void..."
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowVoidModal(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmVoid}
                                disabled={!voidReason.trim()}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                Confirm Void
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Sale Modal */}
            {showEditSaleModal && editSaleTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">Edit Sale #{editSaleTarget.id}</h3>
                        <form onSubmit={submitEditSale} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Sale Date"
                                    type="date"
                                    value={editSaleForm.data.sale_date}
                                    onChange={(value) => editSaleForm.setData('sale_date', value)}
                                />
                                <Select
                                    label="Customer"
                                    value={editSaleForm.data.customer_id}
                                    onChange={(value) => editSaleForm.setData('customer_id', value)}
                                    options={customers.map((c) => ({ value: c.id, label: c.name }))}
                                    placeholder="Walk-in"
                                />
                            </div>
                            <Input
                                label="Delivered By"
                                value={editSaleForm.data.delivered_by}
                                onChange={(value) => editSaleForm.setData('delivered_by', value)}
                            />
                            <Select
                                label="Payment Method"
                                value={editSaleForm.data.payment_method}
                                onChange={(value) => editSaleForm.setData('payment_method', value)}
                                options={[
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'gcash', label: 'GCash' },
                                    { value: 'credit', label: 'Credit' },
                                    { value: 'partial', label: 'Partial' },
                                ]}
                            />
                            {editSaleForm.data.payment_method === 'partial' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Cash Amount"
                                        type="number"
                                        step="0.01"
                                        value={editSaleForm.data.cash_amount}
                                        onChange={(value) => editSaleForm.setData('cash_amount', value)}
                                    />
                                    <Input
                                        label="GCash Amount"
                                        type="number"
                                        step="0.01"
                                        value={editSaleForm.data.gcash_amount}
                                        onChange={(value) => editSaleForm.setData('gcash_amount', value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={editSaleForm.data.notes}
                                    onChange={(e) => editSaleForm.setData('notes', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditSaleModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editSaleForm.processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Edit Expense Modal */}
            {showEditExpenseModal && editExpenseTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">Edit Expense</h3>
                        <form onSubmit={submitEditExpense} className="space-y-3">
                            <Select
                                label="Category"
                                value={editExpenseForm.data.category}
                                onChange={(value) => editExpenseForm.setData('category', value)}
                                options={[
                                    { value: 'Auto Repair', label: 'Auto Repair' },
                                    { value: 'Fuel', label: 'Fuel' },
                                    { value: 'Utilities', label: 'Utilities' },
                                    { value: 'Maintenance', label: 'Maintenance' },
                                    { value: 'Supplies', label: 'Supplies' },
                                    { value: 'Salaries', label: 'Salaries' },
                                    { value: 'Cash Advance', label: 'Cash Advance' },
                                    { value: 'Salary', label: 'Salary' },
                                    { value: 'Others', label: 'Others' },
                                ]}
                            />
                            <Input
                                label="Description"
                                value={editExpenseForm.data.description}
                                onChange={(value) => editExpenseForm.setData('description', value)}
                            />
                            <Input
                                label="Amount"
                                type="number"
                                step="0.01"
                                value={editExpenseForm.data.amount}
                                onChange={(value) => editExpenseForm.setData('amount', value)}
                            />
                            <Select
                                label="Payment Source"
                                value={editExpenseForm.data.payment_source}
                                onChange={(value) => editExpenseForm.setData('payment_source', value)}
                                options={[
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'gcash', label: 'GCash' },
                                ]}
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditExpenseModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editExpenseForm.processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Print Receipt Modal */}
            {showPrintReceipt && lastSaleData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-6 shadow-lg print:shadow-none" id="receipt">
                        <div className="text-center mb-4">
                            <h2 className="text-lg font-bold">Clear Ice</h2>
                            <p className="text-xs text-gray-500">Sales Receipt</p>
                            <p className="text-xs text-gray-500">{lastSaleData.date}</p>
                        </div>
                        <div className="text-sm mb-2">
                            <span className="text-gray-600">Customer: </span>
                            <span className="font-medium">{lastSaleData.customer}</span>
                        </div>
                        <div className="text-sm mb-3">
                            <span className="text-gray-600">Payment: </span>
                            <span className="font-medium uppercase">{lastSaleData.payment_method}</span>
                        </div>
                        <table className="w-full text-xs mb-4 border-t border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-1 text-left">Product</th>
                                    <th className="py-1 text-right">Qty</th>
                                    <th className="py-1 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastSaleData.items.map((item, i) => {
                                    const product = productsById[item.product_id];
                                    const lineTotal = product
                                        ? Math.max(0, Number(item.quantity || 0) * Number(product.price || 0) - Number(item.discount || 0))
                                        : 0;
                                    return (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="py-1">{product?.name || item.product_id}</td>
                                            <td className="py-1 text-right">{item.quantity}</td>
                                            <td className="py-1 text-right">{money(lineTotal)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-sm">
                            <span>TOTAL</span>
                            <span>{money(lastSaleData.total)}</span>
                        </div>
                        <div className="mt-4 flex gap-3 justify-end print:hidden">
                            <button
                                type="button"
                                onClick={() => setShowPrintReceipt(false)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
                            >
                                <FiPrinter /> Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product CRUD Modal */}
            {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">{editProductTarget ? 'Edit Product' : 'Add Product'}</h3>
                        <form onSubmit={submitProduct} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Name" value={productForm.data.name} onChange={(v) => productForm.setData('name', v)} />
                                <Select
                                    label="Category"
                                    value={productForm.data.category}
                                    onChange={(v) => productForm.setData('category', v)}
                                    options={[
                                        { value: 'ice', label: 'Ice' },
                                        { value: 'water', label: 'Water' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                />
                                <Input label="Price" type="number" step="0.01" value={productForm.data.price} onChange={(v) => productForm.setData('price', v)} />
                                <Input label="Ice Size" value={productForm.data.ice_size} onChange={(v) => productForm.setData('ice_size', v)} />
                                <Select
                                    label="Container Type"
                                    value={productForm.data.container_type}
                                    onChange={(v) => productForm.setData('container_type', v)}
                                    options={[
                                        { value: '', label: '— None —' },
                                        { value: 'big_styro', label: 'Big Styro' },
                                        { value: 'small_styro', label: 'Small Styro' },
                                        { value: 'gallon', label: 'Slim Gallon' },
                                        { value: 'round_container', label: 'Round Container' },
                                        { value: 'sack', label: 'Sack' },
                                    ]}
                                    placeholder="None"
                                />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={!!productForm.data.is_returnable} onChange={(e) => productForm.setData('is_returnable', e.target.checked)} /> Returnable Container
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={!!productForm.data.track_inventory} onChange={(e) => productForm.setData('track_inventory', e.target.checked)} /> Track Inventory
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowProductModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={productForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                                    {editProductTarget ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee CRUD Modal */}
            {showEmployeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">{editEmployeeTarget ? 'Edit Employee' : 'Add Employee'}</h3>
                        <form onSubmit={submitEmployee} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Name" value={employeeForm.data.name} onChange={(v) => employeeForm.setData('name', v)} />
                                <Input label="Role / Position" value={employeeForm.data.role} onChange={(v) => employeeForm.setData('role', v)} />
                                <Select
                                    label="Employee Type"
                                    value={employeeForm.data.employee_type}
                                    onChange={(v) => employeeForm.setData('employee_type', v)}
                                    options={[
                                        { value: 'regular', label: 'Regular' },
                                        { value: 'probationary', label: 'Probationary' },
                                    ]}
                                />
                                <Input label="Daily Rate" type="number" step="0.01" value={employeeForm.data.daily_rate} onChange={(v) => employeeForm.setData('daily_rate', v)} />
                                <Input label="OT Rate (per hr)" type="number" step="0.01" value={employeeForm.data.ot_rate} onChange={(v) => employeeForm.setData('ot_rate', v)} />
                                <Input label="Late Rate (per 30-min block)" type="number" step="0.01" value={employeeForm.data.late_rate} onChange={(v) => employeeForm.setData('late_rate', v)} />
                                <Input label="SSS Contribution" type="number" step="0.01" value={employeeForm.data.sss_contribution} onChange={(v) => employeeForm.setData('sss_contribution', v)} />
                                <Input label="PhilHealth Contribution" type="number" step="0.01" value={employeeForm.data.philhealth_contribution} onChange={(v) => employeeForm.setData('philhealth_contribution', v)} />
                                <Input label="Pag-IBIG Contribution" type="number" step="0.01" value={employeeForm.data.pagibig_contribution} onChange={(v) => employeeForm.setData('pagibig_contribution', v)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEmployeeModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={employeeForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                                    {editEmployeeTarget ? 'Save Changes' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Receipt Modal (from History) */}
            {showViewReceiptModal && viewReceiptSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-6 shadow-lg print:shadow-none" id="view-receipt">
                        <div className="mb-3 text-center">
                            <div className="text-lg font-bold tracking-wide">CLEAR ICE INC.</div>
                            <div className="text-xs text-gray-500">Underground Technologies Inc.</div>
                            <div className="text-xs text-gray-500">Tiaong, Quezon</div>
                            <div className="mt-1 border-t border-dashed border-gray-300 pt-1 text-xs text-gray-500">
                                Date: {viewReceiptSale.sale_date} &nbsp;&nbsp; TRX ID: TRX-{String(viewReceiptSale.id).padStart(6, '0')}
                            </div>
                        </div>
                        <div className="mb-1 text-sm">
                            <span className="text-gray-500">Customer: </span>
                            <span className="font-medium">{viewReceiptSale.customer?.name ?? 'Walk-in'}</span>
                        </div>
                        <div className="mb-3 text-sm">
                            <span className="text-gray-500">Staff: </span>
                            <span>{viewReceiptSale.recorder?.name ?? '-'}</span>
                        </div>
                        <table className="w-full border-t border-dashed border-gray-300 text-xs">
                            <thead>
                                <tr>
                                    <th className="py-1 text-left">Item</th>
                                    <th className="py-1 text-right">Price</th>
                                    <th className="py-1 text-right">Qty</th>
                                    <th className="py-1 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(viewReceiptSale.items || []).map((item, i) => {
                                    const lineTotal = Math.max(0, Number(item.quantity || 0) * Number(item.product?.price || 0) - Number(item.discount || 0));
                                    return (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="py-1">{item.product?.name ?? '-'}</td>
                                            <td className="py-1 text-right">{money(item.product?.price)}</td>
                                            <td className="py-1 text-right">x{item.quantity}</td>
                                            <td className="py-1 text-right">{money(lineTotal)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="mt-2 border-t border-dashed border-gray-300 pt-2 flex justify-between text-sm font-bold">
                            <span>TOTAL</span>
                            <span>{money(viewReceiptSale.total_amount)}</span>
                        </div>
                        <div className="mt-1 text-center text-xs text-gray-500 uppercase">
                            Payment: {viewReceiptSale.payment_method}
                        </div>
                        <div className="mt-4 flex justify-end gap-3 print:hidden">
                            <button type="button" onClick={() => setShowViewReceiptModal(false)} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900">
                                <FiPrinter /> Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
