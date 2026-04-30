import { FiEdit2, FiX, FiRefreshCw } from 'react-icons/fi';
import { Input, Select, money } from '@/Components/PosUI';

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
}) {
    return (
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
            </div>
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
    );
}
