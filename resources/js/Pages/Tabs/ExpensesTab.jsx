import { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FiEdit2, FiEye, FiX, FiRefreshCw, FiPlus, FiTrash2, FiTag, FiPrinter } from 'react-icons/fi';
import { Input, Select, money, fmtDate } from '@/Components/PosUI';

export default function ExpensesTab({
    expenseForm,
    submitExpense,
    expensesToday,
    expensesFrom,
    setExpensesFrom,
    expensesTo,
    setExpensesTo,
    loadExpenses,
    openEditExpenseModal,
    deleteExpense,
    expenseCategories,
    expenseCategoryOptions,
}) {
    const [showCatModal, setShowCatModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const catForm = useForm({ name: '' });

    const addCategory = (e) => {
        e.preventDefault();
        catForm.post(route('expense-categories.store'), {
            preserveScroll: true,
            onSuccess: () => catForm.reset(),
        });
    };

    const expenseSummaryByCategory = useMemo(() => {
        const map = new Map();
        (expensesToday || []).forEach((expense) => {
            const key = expense.category || 'Uncategorized';
            map.set(key, Number(map.get(key) || 0) + Number(expense.amount || 0));
        });

        return Array.from(map.entries())
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total);
    }, [expensesToday]);

    const paymentSourceTotals = useMemo(() => {
        return (expensesToday || []).reduce(
            (acc, expense) => {
                const amount = Number(expense.amount || 0);
                if (String(expense.payment_source).toLowerCase() === 'gcash') {
                    acc.gcash += amount;
                } else {
                    acc.cash += amount;
                }
                acc.total += amount;

                return acc;
            },
            { cash: 0, gcash: 0, total: 0 }
        );
    }, [expensesToday]);

    const selectedCategoryExpenses = useMemo(() => {
        if (!selectedCategory) return [];

        return (expensesToday || []).filter(
            (expense) => (expense.category || 'Uncategorized') === selectedCategory,
        );
    }, [expensesToday, selectedCategory]);

    const selectedCategoryTotal = useMemo(
        () => selectedCategoryExpenses.reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0,
        ),
        [selectedCategoryExpenses],
    );

    const printCategoryReport = (category) => {
        const categoryExpenses = (expensesToday || []).filter(
            (expense) => (expense.category || 'Uncategorized') === category,
        );
        const categoryTotal = categoryExpenses.reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0,
        );
        const escapeHtml = (value) => String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        const rowsHtml = categoryExpenses.map((expense) => `
            <tr>
                <td>${escapeHtml(fmtDate(expense.expense_date))}</td>
                <td>${escapeHtml(expense.description)}</td>
                <td>${escapeHtml(String(expense.payment_source || '').toUpperCase())}</td>
                <td class="amount">${escapeHtml(money(expense.amount))}</td>
            </tr>
        `).join('');
        const printWindow = window.open('', '_blank', 'width=900,height=700');

        if (!printWindow) {
            window.alert('Please allow pop-ups to print this category report.');
            return;
        }

        printWindow.document.write(`
            <!doctype html>
            <html>
                <head>
                    <title>${escapeHtml(category)} Expense Report</title>
                    <style>
                        body { color: #111827; font-family: Arial, sans-serif; margin: 28px; }
                        h1 { font-size: 20px; margin: 0 0 4px; }
                        h2 { font-size: 16px; margin: 20px 0 4px; }
                        p { color: #4b5563; font-size: 12px; margin: 0 0 4px; }
                        table { border-collapse: collapse; font-size: 12px; margin-top: 16px; width: 100%; }
                        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                        th { background: #f3f4f6; }
                        .amount { text-align: right; white-space: nowrap; }
                        .total td { background: #fef2f2; color: #991b1b; font-weight: 700; }
                        @media print { body { margin: 12mm; } }
                    </style>
                </head>
                <body>
                    <h1>CLEAR ICE INC.</h1>
                    <p>Expense Report by Category</p>
                    <h2>${escapeHtml(category)}</h2>
                    <p>Coverage: ${escapeHtml(expensesFrom)} to ${escapeHtml(expensesTo)}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Payment Source</th>
                                <th class="amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                            <tr class="total">
                                <td colspan="3">TOTAL</td>
                                <td class="amount">${escapeHtml(money(categoryTotal))}</td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
        {selectedCategory && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                    <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">{selectedCategory} Expenses</h3>
                            <p className="mt-1 text-xs text-gray-500">Coverage: {expensesFrom} to {expensesTo}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Close category report"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                    <div className="overflow-auto p-5">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-700">
                                    <th className="px-3 py-2">Date</th>
                                    <th className="px-3 py-2">Description</th>
                                    <th className="px-3 py-2">Payment Source</th>
                                    <th className="px-3 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCategoryExpenses.map((expense) => (
                                    <tr key={expense.id} className="border-t border-gray-200">
                                        <td className="whitespace-nowrap px-3 py-2">{fmtDate(expense.expense_date)}</td>
                                        <td className="px-3 py-2">{expense.description}</td>
                                        <td className="px-3 py-2 uppercase">{expense.payment_source}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-right">{money(expense.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-red-200 bg-red-50 font-semibold text-red-900">
                                    <td colSpan={3} className="px-3 py-2">TOTAL</td>
                                    <td className="whitespace-nowrap px-3 py-2 text-right">{money(selectedCategoryTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => printCategoryReport(selectedCategory)}
                            className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
                        >
                            <FiPrinter size={14} /> Print Category
                        </button>
                    </div>
                </div>
            </div>
        )}
        {showCatModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
                    <div className="flex items-center gap-3 rounded-t-2xl bg-blue-50 px-5 py-4 border-b border-blue-100">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                            <FiTag className="text-blue-600" size={18} />
                        </div>
                        <h3 className="text-base font-semibold text-blue-900">Manage Categories</h3>
                        <button
                            type="button"
                            onClick={() => setShowCatModal(false)}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        {/* Add new */}
                        <form onSubmit={addCategory} className="flex gap-2">
                            <input
                                type="text"
                                value={catForm.data.name}
                                onChange={(e) => catForm.setData('name', e.target.value)}
                                placeholder="New category name"
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={catForm.processing || !catForm.data.name.trim()}
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <FiPlus size={14} /> Add
                            </button>
                        </form>
                        {catForm.errors.name && (
                            <p className="text-xs text-red-600">{catForm.errors.name}</p>
                        )}
                        {/* List */}
                        <ul className="max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-md border border-gray-200">
                            {(expenseCategories || []).map((cat) => (
                                <li key={cat.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-800">
                                    {cat.name}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            catForm.delete(route('expense-categories.destroy', cat.id), { preserveScroll: true });
                                        }}
                                        className="ml-2 text-red-400 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )}
        <section className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Log Expense</h3>
                <button
                    type="button"
                    onClick={() => setShowCatModal(true)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiTag size={14} /> Categories
                </button>
            </div>
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
                    options={expenseCategoryOptions}
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
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Expenses</h4>
            <div className="mb-3 flex flex-wrap items-end gap-2">
                <div>
                    <Input
                        label="From"
                        type="date"
                        value={expensesFrom}
                        onChange={setExpensesFrom}
                    />
                </div>
                <div>
                    <Input
                        label="To"
                        type="date"
                        value={expensesTo}
                        onChange={setExpensesTo}
                    />
                </div>
                <button
                    type="button"
                    onClick={loadExpenses}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FiRefreshCw size={14} /> View
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
                >
                    <FiPrinter size={14} /> Print
                </button>
            </div>
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                        <div className="text-xs uppercase text-gray-500">Cash Expenses</div>
                        <div className="text-base font-semibold text-gray-900">{money(paymentSourceTotals.cash)}</div>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                        <div className="text-xs uppercase text-gray-500">GCash Expenses</div>
                        <div className="text-base font-semibold text-gray-900">{money(paymentSourceTotals.gcash)}</div>
                    </div>
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm">
                        <div className="text-xs uppercase text-red-700">Total Expenses</div>
                        <div className="text-base font-bold text-red-800">{money(paymentSourceTotals.total)}</div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="px-3 py-2">Date</th>
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
                                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">No expenses found</td>
                                </tr>
                            ) : (
                                (expensesToday || []).map((expense) => (
                                    <tr key={expense.id} className="border-t border-gray-200">
                                        <td className="px-3 py-2 whitespace-nowrap">{fmtDate(expense.expense_date)}</td>
                                        <td className="px-3 py-2">{expense.category}</td>
                                        <td className="px-3 py-2">{expense.description}</td>
                                        <td className="px-3 py-2">{money(expense.amount)}</td>
                                        <td className="px-3 py-2 uppercase">{expense.payment_source}</td>
                                        <td className="px-3 py-2 flex gap-2">
                                            {(expense.is_salary_payment || expense.is_cash_advance) && (
                                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                    Auto-posted from Payroll
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => openEditExpenseModal(expense)}
                                                disabled={expense.is_salary_payment || expense.is_cash_advance}
                                                title={expense.is_salary_payment || expense.is_cash_advance ? 'This expense is auto-posted from Payroll and cannot be edited here.' : 'Edit'}
                                                className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteExpense(expense)}
                                                disabled={expense.is_salary_payment || expense.is_cash_advance}
                                                title={expense.is_salary_payment || expense.is_cash_advance ? 'This expense is auto-posted from Payroll and cannot be deleted here.' : 'Delete'}
                                                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-md border border-gray-200 bg-white p-3">
                        <h5 className="mb-2 text-sm font-semibold text-gray-800">Expense Summary by Category</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-gray-700">
                                        <th className="px-3 py-2">Category</th>
                                        <th className="px-3 py-2">Total Amount</th>
                                        <th className="px-3 py-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenseSummaryByCategory.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-3 py-4 text-center text-gray-500">No expenses for this date coverage</td>
                                        </tr>
                                    ) : (
                                        expenseSummaryByCategory.map((row) => (
                                            <tr key={row.category} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{row.category}</td>
                                                <td className="px-3 py-2 font-medium">{money(row.total)}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedCategory(row.category)}
                                                            className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <FiEye size={12} /> View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => printCategoryReport(row.category)}
                                                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <FiPrinter size={12} /> Print
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    <tr className="border-t border-gray-300 bg-red-50 font-semibold text-red-900">
                                        <td className="px-3 py-2">TOTAL</td>
                                        <td className="px-3 py-2">{money(paymentSourceTotals.total)}</td>
                                        <td className="px-3 py-2" />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-md border border-gray-200 bg-white p-3">
                        <h5 className="mb-2 text-sm font-semibold text-gray-800">Generated Expense Report</h5>
                        <p className="mb-2 text-xs text-gray-500">
                            Coverage: {expensesFrom} to {expensesTo}
                        </p>
                        <p className="text-sm text-gray-700">
                            This report is automatically generated from all encoded expenses in the selected date coverage,
                            with totals by payment source and by category.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
