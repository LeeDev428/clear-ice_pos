import { FiUsers, FiRefreshCw, FiPlus, FiEdit2, FiX, FiPrinter } from 'react-icons/fi';
import { Input, Select, DataTable, money } from '@/Components/PosUI';

export default function PayrollTab({
    payrollSubTab,
    setPayrollSubTab,
    payrollForm,
    submitPayroll,
    payrollDate,
    setPayrollDate,
    loadPayroll,
    payrollToday,
    employees,
    openAddEmployee,
    openEditEmployee,
    deactivateEmployee,
    cashAdvanceForm,
    submitCashAdvance,
    cashAdvances,
    periodEmployee,
    setPeriodEmployee,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    periodPaymentDate,
    setPeriodPaymentDate,
    loadPeriodLogs,
    payrollPreview,
    selectedPeriodEmployee,
    caDeducted,
    setCaDeducted,
    deductSSS,
    setDeductSSS,
    deductPH,
    setDeductPH,
    deductHDMF,
    setDeductHDMF,
    submitFinalizePayroll,
}) {
    return (
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
    );
}
