import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
        setShowPwd(false);
    };

    return (
        <section>
            <h2 className="text-base font-semibold text-gray-900">Delete Account</h2>
            <p className="mt-1 text-sm text-gray-500">
                Once deleted, all your data will be permanently removed. This action cannot be undone.
            </p>

            <button
                type="button"
                onClick={() => setConfirmingUserDeletion(true)}
                className="mt-4 rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
                Delete Account
            </button>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center gap-3 rounded-t-2xl bg-red-50 px-6 py-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">⚠</span>
                            <h3 className="text-base font-bold text-gray-900">Delete Account</h3>
                        </div>
                        <form onSubmit={deleteUser}>
                            <div className="px-6 py-5 space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    This will permanently delete your account and all associated data. Enter your password to confirm.
                                </p>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <input
                                            ref={passwordInput}
                                            type={showPwd ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoFocus
                                            className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-800 focus:outline-none ${
                                                errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            placeholder="Your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd((v) => !v)}
                                            tabIndex={-1}
                                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
