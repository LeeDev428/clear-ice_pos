import { useState } from 'react';
import { FiEdit2, FiUserX, FiUserCheck, FiPlus } from 'react-icons/fi';
import { Input } from '@/Components/PosUI';

export default function UserManagementTab({
    users,
    userMgmtForm,
    submitUser,
    openEditUser,
    deactivateUser,
    reactivateUser,
    showUserModal,
    setShowUserModal,
    editUserTarget,
    setEditUserTarget,
}) {
    const [search, setSearch] = useState('');

    const filtered = (users || []).filter(
        (u) =>
            !search ||
            (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <section className="space-y-4">
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setEditUserTarget(null);
                            userMgmtForm.reset();
                            setShowUserModal(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <FiPlus size={14} /> Add User
                    </button>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`border-t border-gray-200 ${!user.is_active ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-3 py-2 font-medium">{user.name}</td>
                                        <td className="px-3 py-2 text-gray-600">{user.email}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    user.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditUser(user)}
                                                className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            {user.is_active ? (
                                                <button
                                                    type="button"
                                                    onClick={() => deactivateUser(user)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                                >
                                                    <FiUserX size={12} /> Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => reactivateUser(user)}
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
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-3 text-base font-semibold text-gray-900">
                            {editUserTarget ? 'Edit User' : 'Add User'}
                        </h3>
                        <form onSubmit={submitUser} className="space-y-3">
                            <Input
                                label="Name"
                                value={userMgmtForm.data.name}
                                onChange={(v) => userMgmtForm.setData('name', v)}
                                error={userMgmtForm.errors.name}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={userMgmtForm.data.email}
                                onChange={(v) => userMgmtForm.setData('email', v)}
                                error={userMgmtForm.errors.email}
                            />
                            <Input
                                label={editUserTarget ? 'New Password (leave blank to keep current)' : 'Password'}
                                type="password"
                                value={userMgmtForm.data.password}
                                onChange={(v) => userMgmtForm.setData('password', v)}
                                error={userMgmtForm.errors.password}
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                value={userMgmtForm.data.password_confirmation}
                                onChange={(v) => userMgmtForm.setData('password_confirmation', v)}
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUserModal(false);
                                        userMgmtForm.reset();
                                        setEditUserTarget(null);
                                    }}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={userMgmtForm.processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editUserTarget ? 'Save Changes' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
