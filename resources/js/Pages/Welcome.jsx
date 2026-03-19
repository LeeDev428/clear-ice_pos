import { Head, Link } from '@inertiajs/react';

const CLEAR_ICE_LOGO = '/img/logo/clear%20ice%20pos%20-%20logo.png';

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <>
            <Head title="Clear Ice POS" />

            <div className="min-h-screen bg-gray-100 text-gray-900">
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={CLEAR_ICE_LOGO}
                                alt="Clear Ice POS"
                                className="h-11 w-11 object-contain"
                            />
                            <div>
                                <p className="text-lg font-bold">Clear Ice POS</p>
                                <p className="text-xs text-gray-500">Ice Store Sales and Operations</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Open Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-2">
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h1 className="text-3xl font-bold tracking-tight">Clear Ice POS</h1>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            A focused point-of-sale and inventory system for daily ice operations,
                            container monitoring, collections, expenses, payroll posting, and end-of-day cash reconciliation.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Feature title="Sales and Credit" text="Cash, GCash, and credit with payment tracking." />
                            <Feature title="Inventory and Variance" text="Daily counts with expected-vs-actual variance." />
                            <Feature title="Container Monitoring" text="Track gallon and styro borrow/returns by customer." />
                            <Feature title="Finance Modules" text="Expenses, collections, payroll, and Z-read snapshot." />
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">System Branding</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            The system uses the official Clear Ice POS logo for the application logo,
                            browser icon, and favicon for a consistent brand identity.
                        </p>

                        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
                            <img
                                src={CLEAR_ICE_LOGO}
                                alt="Clear Ice POS brand logo"
                                className="h-40 w-full object-contain"
                            />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

function Feature({ title, text }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="mt-1 text-xs text-gray-600">{text}</p>
        </div>
    );
}
