import { useState } from 'react';
import { FiEdit2, FiUserX, FiUserCheck, FiPlus } from 'react-icons/fi';
import { Input } from '@/Components/PosUI';

export default function CustomerTab({
    allCustomers,
    customerForm,
    submitCustomer,
    openEditCustomer,
    deactivateCustomer,
    reactivateCustomer,
    showCustomerModal,
    setShowCustomerModal,
    editCustomerTarget,
    setEditCustomerTarget,
}) {
    const [search, setSearch] = useState('');

    const filtered = (allCustomers || []).filter(
        (c) =>
            !search ||
            (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (c.phone || '').includes(search),
    );

    return (
        <section className="space-y-4">
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setEditCustomerTarget(null);
                            customerForm.reset();
                            setShowCustomerModal(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <FiPlus size={14} /> Add Customer
                    </button>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Address</th>
                                <th className="px-3 py-2">Type</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className={`border-t border-gray-200 ${!customer.is_active ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-3 py-2 font-medium">{customer.name}</td>
                                        <td className="px-3 py-2 text-gray-600">{customer.phone || '—'}</td>
                                        <td className="px-3 py-2 text-gray-600">{customer.address || '—'}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    customer.is_walk_in
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {customer.is_walk_in ? 'Walk-in' : 'Regular'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    customer.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditCustomer(customer)}
                                                className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            {customer.is_active ? (
                                                <button
                                                    type="button"
                                                    onClick={() => deactivateCustomer(customer)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                                >
                                                    <FiUserX size={12} /> Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => reactivateCustomer(customer)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50"
                                                >
                                                    <FiUserCheck size={12} /> Reactivate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showCustomerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">
                            {editCustomerTarget ? 'Edit Customer' : 'Add Customer'}
                        </h3>
                        <form onSubmit={submitCustomer} className="space-y-3">
                            <Input
                                label="Name"
                                value={customerForm.data.name}
                                onChange={(v) => customerForm.setData('name', v)}
                            />
                            <Input
                                label="Phone"
                                value={customerForm.data.phone}
                                onChange={(v) => customerForm.setData('phone', v)}
                            />
                            <Input
                                label="Address"
                                value={customerForm.data.address}
                                onChange={(v) => customerForm.setData('address', v)}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_walk_in"
                                    checked={!!customerForm.data.is_walk_in}
                                    onChange={(e) => customerForm.setData('is_walk_in', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_walk_in" className="text-sm font-medium text-gray-700">
                                    Walk-in customer
                                </label>
                            </div>
                            {Object.values(customerForm.errors || {}).map((err, i) => (
                                <p key={i} className="text-sm text-red-600">{err}</p>
                            ))}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCustomerModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={customerForm.processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editCustomerTarget ? 'Save Changes' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
