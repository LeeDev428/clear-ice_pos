import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function PwdInput({ label, id, value, onChange, error, inputRef, autoComplete }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    ref={inputRef}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-800 focus:outline-none ${
                        error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                    {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) { reset('password', 'password_confirmation'); passwordInput.current?.focus(); }
                if (errs.current_password) { reset('current_password'); currentPasswordInput.current?.focus(); }
            },
        });
    };

    return (
        <section>
            <h2 className="text-base font-semibold text-gray-900">Update Password</h2>
            <p className="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password.</p>

            <form onSubmit={updatePassword} className="mt-5 space-y-4">
                <PwdInput
                    label="Current Password"
                    id="current_password"
                    value={data.current_password}
                    onChange={(v) => setData('current_password', v)}
                    error={errors.current_password}
                    inputRef={currentPasswordInput}
                    autoComplete="current-password"
                />
                <PwdInput
                    label="New Password"
                    id="password"
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    error={errors.password}
                    inputRef={passwordInput}
                    autoComplete="new-password"
                />
                <PwdInput
                    label="Confirm Password"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(v) => setData('password_confirmation', v)}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                />

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Update Password
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-600">Password updated.</span>
                    )}
                </div>
            </form>
        </section>
    );
}
