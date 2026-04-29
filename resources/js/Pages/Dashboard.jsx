import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { FiPrinter } from 'react-icons/fi';
import { Input, Select, money } from '@/Components/PosUI';
import SalesTab from './Tabs/SalesTab';
import InventoryTab from './Tabs/InventoryTab';
import ExpensesTab from './Tabs/ExpensesTab';
import RecordsTab from './Tabs/RecordsTab';
import HistoryTab from './Tabs/HistoryTab';
import DashboardTab from './Tabs/DashboardTab';
import ZReadTab from './Tabs/ZReadTab';
import PayrollTab from './Tabs/PayrollTab';

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
        products.forEach((product) => { map[product.id] = product; });
        return map;
    }, [products]);

    const saleTotal = useMemo(() => {
        return salesForm.data.items.reduce((sum, item) => {
            const product = productsById[item.product_id];
            if (!product) return sum;
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
        const rows = periodTimeLogs.map((log) => {
            const isHalf = log.shift_type === 'half_day';
            const dayEarned = isHalf ? (Number(emp.daily_rate) / 2) : Number(emp.daily_rate);
            const otEarned = Number(log.ot_hours || 0) * Number(emp.ot_rate || 0);
            const bonus = Number(log.bonus || 0);
            const late = Number(log.late_deduction || 0);
            const earned = dayEarned + otEarned + bonus - late;
            grossPay += earned;
            totalLateDeduction += late;
            return { log, dayEarned, otEarned, bonus, late, earned, isHalf };
        });
        const sss = deductSSS ? Number(emp.sss_contribution || 0) : 0;
        const ph = deductPH ? Number(emp.philhealth_contribution || 0) : 0;
        const hdmf = deductHDMF ? Number(emp.pagibig_contribution || 0) : 0;
        const ca = Number(caDeducted || 0);
        const totalDeductions = sss + ph + hdmf + ca + totalLateDeduction;
        const netPay = Math.max(0, grossPay - totalDeductions);
        return { rows, grossPay, totalLateDeduction, sss, ph, hdmf, ca, totalDeductions, netPay };
    }, [periodTimeLogs, selectedPeriodEmployee, deductSSS, deductPH, deductHDMF, caDeducted]);

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
        expenseForm.transform((data) => ({ ...data, amount: Number(data.amount || 0) }));
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
        inventoryForm.post(route('inventory-counts.store'), { preserveScroll: true });
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
        waterRestockForm.transform((data) => ({ ...data, quantity: Number(data.quantity || 0) }));
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
        router.reload({ only: ['history', 'historyDate'], data: { date: historyDate } });
    };

    const loadPayroll = () => {
        router.reload({ only: ['payrollToday', 'payrollDate'], data: { payroll_date: payrollDate } });
    };

    const loadZread = () => {
        router.reload({ only: ['zreadTotals', 'zreadDate'], data: { zread_date: zreadDate } });
    };

    const loadDashboard = () => {
        router.reload({ only: ['dashboardTotals', 'dashboardDate'], data: { dashboard_date: dashboardDate } });
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

    const submitCashAdvance = (event) => {
        event.preventDefault();
        cashAdvanceForm.post(route('cash-advances.store'), {
            preserveScroll: true,
            onSuccess: () => cashAdvanceForm.reset('amount', 'notes'),
        });
    };

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
                    <SalesTab
                        salesForm={salesForm}
                        saleTotal={saleTotal}
                        productsById={productsById}
                        products={products}
                        customers={customers}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        posQty={posQty}
                        setPosQty={setPosQty}
                        posDiscount={posDiscount}
                        setPosDiscount={setPosDiscount}
                        posBorrowedQty={posBorrowedQty}
                        setPosBorrowedQty={setPosBorrowedQty}
                        addToCart={addToCart}
                        updateSaleItem={updateSaleItem}
                        submitSale={submitSale}
                        openAddProduct={openAddProduct}
                    />
                )}

                {activeTab === 'Inventory' && (
                    <InventoryTab
                        inventoryForm={inventoryForm}
                        submitInventory={submitInventory}
                        inventoryMode={inventoryMode}
                        setInventoryMode={setInventoryMode}
                        inventoryToday={inventoryToday}
                        waterRestocksToday={waterRestocksToday}
                        waterRestockForm={waterRestockForm}
                        submitWaterRestock={submitWaterRestock}
                    />
                )}

                {activeTab === 'Expenses' && (
                    <ExpensesTab
                        expenseForm={expenseForm}
                        submitExpense={submitExpense}
                        expensesToday={expensesToday}
                        openEditExpenseModal={openEditExpenseModal}
                        deleteExpense={deleteExpense}
                    />
                )}

                {activeTab === 'Records' && (
                    <RecordsTab
                        collectionForm={collectionForm}
                        submitCollection={submitCollection}
                        containerReturnForm={containerReturnForm}
                        submitContainerReturn={submitContainerReturn}
                        customers={customers}
                        unpaidBalances={unpaidBalances}
                        borrowedContainers={borrowedContainers}
                        recordsSearch={recordsSearch}
                        setRecordsSearch={setRecordsSearch}
                        containerSearch={containerSearch}
                        setContainerSearch={setContainerSearch}
                    />
                )}

                {activeTab === 'History' && (
                    <HistoryTab
                        history={history}
                        historyDate={historyDate}
                        setHistoryDate={setHistoryDate}
                        loadHistory={loadHistory}
                        openVoidModal={openVoidModal}
                        openEditSaleModal={openEditSaleModal}
                        setViewReceiptSale={setViewReceiptSale}
                        setShowViewReceiptModal={setShowViewReceiptModal}
                    />
                )}

                {activeTab === 'Dashboard' && (
                    <DashboardTab
                        dashboardDate={dashboardDate}
                        setDashboardDate={setDashboardDate}
                        loadDashboard={loadDashboard}
                        dashboardTotals={dashboardTotals}
                        outstandingDebt={outstandingDebt}
                        salesTrend={salesTrend}
                        topProducts={topProducts}
                    />
                )}

                {activeTab === 'Z-Read' && (
                    <ZReadTab
                        zreadDate={zreadDate}
                        setZreadDate={setZreadDate}
                        loadZread={loadZread}
                        zreadTotals={zreadTotals}
                        actualCashRemitted={actualCashRemitted}
                        setActualCashRemitted={setActualCashRemitted}
                        zReadVariance={zReadVariance}
                    />
                )}

                {activeTab === 'Payroll' && (
                    <PayrollTab
                        payrollSubTab={payrollSubTab}
                        setPayrollSubTab={setPayrollSubTab}
                        payrollForm={payrollForm}
                        submitPayroll={submitPayroll}
                        payrollDate={payrollDate}
                        setPayrollDate={setPayrollDate}
                        loadPayroll={loadPayroll}
                        payrollToday={payrollToday}
                        employees={employees}
                        openAddEmployee={openAddEmployee}
                        openEditEmployee={openEditEmployee}
                        deactivateEmployee={deactivateEmployee}
                        cashAdvanceForm={cashAdvanceForm}
                        submitCashAdvance={submitCashAdvance}
                        cashAdvances={cashAdvances}
                        periodEmployee={periodEmployee}
                        setPeriodEmployee={setPeriodEmployee}
                        periodStart={periodStart}
                        setPeriodStart={setPeriodStart}
                        periodEnd={periodEnd}
                        setPeriodEnd={setPeriodEnd}
                        periodPaymentDate={periodPaymentDate}
                        setPeriodPaymentDate={setPeriodPaymentDate}
                        loadPeriodLogs={loadPeriodLogs}
                        payrollPreview={payrollPreview}
                        selectedPeriodEmployee={selectedPeriodEmployee}
                        caDeducted={caDeducted}
                        setCaDeducted={setCaDeducted}
                        deductSSS={deductSSS}
                        setDeductSSS={setDeductSSS}
                        deductPH={deductPH}
                        setDeductPH={setDeductPH}
                        deductHDMF={deductHDMF}
                        setDeductHDMF={setDeductHDMF}
                        submitFinalizePayroll={submitFinalizePayroll}
                    />
                )}
            </div>

            {/* Void Modal */}
            {showVoidModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">Void Sale</h3>
                        <p className="mb-3 text-sm text-gray-600">Please provide a reason for voiding this sale.</p>
                        <textarea
                            value={voidReason}
                            onChange={(e) => setVoidReason(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Reason for void..."
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowVoidModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={confirmVoid} disabled={!voidReason.trim()} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">Confirm Void</button>
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
                                <Input label="Sale Date" type="date" value={editSaleForm.data.sale_date} onChange={(value) => editSaleForm.setData('sale_date', value)} />
                                <Select label="Customer" value={editSaleForm.data.customer_id} onChange={(value) => editSaleForm.setData('customer_id', value)} options={customers.map((c) => ({ value: c.id, label: c.name }))} placeholder="Walk-in" />
                            </div>
                            <Input label="Delivered By" value={editSaleForm.data.delivered_by} onChange={(value) => editSaleForm.setData('delivered_by', value)} />
                            <Select label="Payment Method" value={editSaleForm.data.payment_method} onChange={(value) => editSaleForm.setData('payment_method', value)} options={[{ value: 'cash', label: 'Cash' }, { value: 'gcash', label: 'GCash' }, { value: 'credit', label: 'Credit' }, { value: 'partial', label: 'Partial' }]} />
                            {editSaleForm.data.payment_method === 'partial' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Cash Amount" type="number" step="0.01" value={editSaleForm.data.cash_amount} onChange={(value) => editSaleForm.setData('cash_amount', value)} />
                                    <Input label="GCash Amount" type="number" step="0.01" value={editSaleForm.data.gcash_amount} onChange={(value) => editSaleForm.setData('gcash_amount', value)} />
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                <textarea value={editSaleForm.data.notes} onChange={(e) => editSaleForm.setData('notes', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" rows={2} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEditSaleModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={editSaleForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
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
                            <Select label="Category" value={editExpenseForm.data.category} onChange={(value) => editExpenseForm.setData('category', value)} options={[{ value: 'Auto Repair', label: 'Auto Repair' }, { value: 'Fuel', label: 'Fuel' }, { value: 'Utilities', label: 'Utilities' }, { value: 'Maintenance', label: 'Maintenance' }, { value: 'Supplies', label: 'Supplies' }, { value: 'Salaries', label: 'Salaries' }, { value: 'Cash Advance', label: 'Cash Advance' }, { value: 'Salary', label: 'Salary' }, { value: 'Others', label: 'Others' }]} />
                            <Input label="Description" value={editExpenseForm.data.description} onChange={(value) => editExpenseForm.setData('description', value)} />
                            <Input label="Amount" type="number" step="0.01" value={editExpenseForm.data.amount} onChange={(value) => editExpenseForm.setData('amount', value)} />
                            <Select label="Payment Source" value={editExpenseForm.data.payment_source} onChange={(value) => editExpenseForm.setData('payment_source', value)} options={[{ value: 'cash', label: 'Cash' }, { value: 'gcash', label: 'GCash' }]} />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEditExpenseModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={editExpenseForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
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
                        <div className="text-sm mb-2"><span className="text-gray-600">Customer: </span><span className="font-medium">{lastSaleData.customer}</span></div>
                        <div className="text-sm mb-3"><span className="text-gray-600">Payment: </span><span className="font-medium uppercase">{lastSaleData.payment_method}</span></div>
                        <table className="w-full text-xs mb-4 border-t border-gray-200">
                            <thead><tr className="bg-gray-50"><th className="py-1 text-left">Product</th><th className="py-1 text-right">Qty</th><th className="py-1 text-right">Total</th></tr></thead>
                            <tbody>
                                {lastSaleData.items.map((item, i) => {
                                    const product = productsById[item.product_id];
                                    const lineTotal = product ? Math.max(0, Number(item.quantity || 0) * Number(product.price || 0) - Number(item.discount || 0)) : 0;
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
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-sm"><span>TOTAL</span><span>{money(lastSaleData.total)}</span></div>
                        <div className="mt-4 flex gap-3 justify-end print:hidden">
                            <button type="button" onClick={() => setShowPrintReceipt(false)} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"><FiPrinter /> Print</button>
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
                                <Select label="Category" value={productForm.data.category} onChange={(v) => productForm.setData('category', v)} options={[{ value: 'ice', label: 'Ice' }, { value: 'water', label: 'Water' }, { value: 'other', label: 'Other' }]} />
                                <Input label="Price" type="number" step="0.01" value={productForm.data.price} onChange={(v) => productForm.setData('price', v)} />
                                <Input label="Ice Size" value={productForm.data.ice_size} onChange={(v) => productForm.setData('ice_size', v)} />
                                <Select label="Container Type" value={productForm.data.container_type} onChange={(v) => productForm.setData('container_type', v)} options={[{ value: '', label: '— None —' }, { value: 'big_styro', label: 'Big Styro' }, { value: 'small_styro', label: 'Small Styro' }, { value: 'gallon', label: 'Slim Gallon' }, { value: 'round_container', label: 'Round Container' }, { value: 'sack', label: 'Sack' }]} placeholder="None" />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!productForm.data.is_returnable} onChange={(e) => productForm.setData('is_returnable', e.target.checked)} /> Returnable Container</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!productForm.data.track_inventory} onChange={(e) => productForm.setData('track_inventory', e.target.checked)} /> Track Inventory</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowProductModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={productForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{editProductTarget ? 'Save Changes' : 'Add Product'}</button>
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
                                <Select label="Employee Type" value={employeeForm.data.employee_type} onChange={(v) => employeeForm.setData('employee_type', v)} options={[{ value: 'regular', label: 'Regular' }, { value: 'probationary', label: 'Probationary' }]} />
                                <Input label="Daily Rate" type="number" step="0.01" value={employeeForm.data.daily_rate} onChange={(v) => employeeForm.setData('daily_rate', v)} />
                                <Input label="OT Rate (per hr)" type="number" step="0.01" value={employeeForm.data.ot_rate} onChange={(v) => employeeForm.setData('ot_rate', v)} />
                                <Input label="Late Rate (per 30-min block)" type="number" step="0.01" value={employeeForm.data.late_rate} onChange={(v) => employeeForm.setData('late_rate', v)} />
                                <Input label="SSS Contribution" type="number" step="0.01" value={employeeForm.data.sss_contribution} onChange={(v) => employeeForm.setData('sss_contribution', v)} />
                                <Input label="PhilHealth Contribution" type="number" step="0.01" value={employeeForm.data.philhealth_contribution} onChange={(v) => employeeForm.setData('philhealth_contribution', v)} />
                                <Input label="Pag-IBIG Contribution" type="number" step="0.01" value={employeeForm.data.pagibig_contribution} onChange={(v) => employeeForm.setData('pagibig_contribution', v)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEmployeeModal(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={employeeForm.processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{editEmployeeTarget ? 'Save Changes' : 'Add Employee'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Receipt Modal */}
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
                        <div className="mb-1 text-sm"><span className="text-gray-500">Customer: </span><span className="font-medium">{viewReceiptSale.customer?.name ?? 'Walk-in'}</span></div>
                        <div className="mb-3 text-sm"><span className="text-gray-500">Staff: </span><span>{viewReceiptSale.recorder?.name ?? '-'}</span></div>
                        <table className="w-full border-t border-dashed border-gray-300 text-xs">
                            <thead><tr><th className="py-1 text-left">Item</th><th className="py-1 text-right">Price</th><th className="py-1 text-right">Qty</th><th className="py-1 text-right">Total</th></tr></thead>
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
                        <div className="mt-2 border-t border-dashed border-gray-300 pt-2 flex justify-between text-sm font-bold"><span>TOTAL</span><span>{money(viewReceiptSale.total_amount)}</span></div>
                        <div className="mt-1 text-center text-xs text-gray-500 uppercase">Payment: {viewReceiptSale.payment_method}</div>
                        <div className="mt-4 flex justify-end gap-3 print:hidden">
                            <button type="button" onClick={() => setShowViewReceiptModal(false)} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"><FiPrinter /> Print</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
