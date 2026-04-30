import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section>
            <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-500">Update your account name and email address.</p>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        className={`w-full rounded-md border px-3 py-2 text-sm text-gray-800 focus:outline-none ${
                            errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        className={`w-full rounded-md border px-3 py-2 text-sm text-gray-800 focus:outline-none ${
                            errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                        Your email address is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:text-yellow-900"
                        >
                            Re-send verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-medium text-green-700">Verification link sent!</p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Save Changes
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-600">Saved successfully.</span>
                    )}
                </div>
            </form>
        </section>
    );
}
