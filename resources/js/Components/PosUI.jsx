import { useEffect } from 'react';

export const money = (value) => `PHP ${Number(value || 0).toFixed(2)}`;

export const fmtDate = (d) => (d ? String(d).slice(0, 10) : '-');

export const fmtDateTime = (d) => {
    if (!d) return '-';
    const s = String(d);
    const date = s.slice(0, 10);
    const time = s.slice(11, 16);
    return time ? `${date} ${time}` : date;
};

export function SummaryCard({ icon, title, value }) {
    return (
        <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                {icon} {title}
            </div>
            <div className="text-lg font-semibold text-gray-900">{value}</div>
        </div>
    );
}

export function Input({ label, onChange, readOnly = false, error, ...props }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
                {...props}
                readOnly={readOnly}
                onChange={(event) => onChange?.(event.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm text-gray-800 focus:outline-none ${
                    error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export function Select({ label, value, onChange, options, placeholder }) {
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

export function DataTable({ title, icon, headers, rows }) {
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

export function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    const isSuccess = type === 'success';

    return (
        <div
            style={{ animation: 'slideInRight 0.3s ease-out' }}
            className={`fixed right-5 top-5 z-[9999] flex w-80 items-start gap-4 rounded-xl px-5 py-4 shadow-2xl ${
                isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
            }`}
        >
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isSuccess ? 'bg-white/20' : 'bg-white/20'
            }`}>
                {isSuccess ? '✓' : '✕'}
            </span>
            <div className="flex-1">
                <p className="text-sm font-semibold leading-snug">{message}</p>
                <p className="mt-0.5 text-xs opacity-75">{isSuccess ? 'Operation successful' : 'Something went wrong'}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="ml-1 shrink-0 text-lg leading-none opacity-60 hover:opacity-100"
            >
                ✕
            </button>
            <style>{`@keyframes slideInRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        </div>
    );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                style={{ animation: 'fadeScaleIn 0.2s ease-out' }}
                className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl"
            >
                <div className={`flex items-center gap-3 rounded-t-2xl px-6 py-5 ${variant === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {variant === 'danger' ? '⚠' : 'ℹ'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                </div>
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                </div>
                <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors ${
                            variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
            <style>{`@keyframes fadeScaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        </div>
    );
}
