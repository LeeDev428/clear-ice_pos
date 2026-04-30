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
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div
            className={`fixed right-4 top-4 z-[9999] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
                type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
            }`}
        >
            <span className="mt-0.5 shrink-0 text-base font-bold">
                {type === 'success' ? '✓' : '✗'}
            </span>
            <span className="flex-1">{message}</span>
            <button
                type="button"
                onClick={onClose}
                className="ml-1 shrink-0 text-base leading-none opacity-50 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
}
