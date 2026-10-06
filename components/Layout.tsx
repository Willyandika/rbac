'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'editor';
}

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({
    children,
}: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] =
        useState<User | null>(null);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const isLoginPage =
        pathname === '/login';

    useEffect(() => {
        const storedUser =
            localStorage.getItem('user');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push('/login');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }

        return pathname.startsWith(path);
    };

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup menu"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
                />
            )}


            {/* =========================================
                SIDEBAR
            ========================================= */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                    }`}
            >

                {/* LOGO */}
                <div className="flex h-[72px] items-center border-b border-gray-100 px-6">

                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">

                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />

                                <rect
                                    x="14"
                                    y="3"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />

                                <rect
                                    x="3"
                                    y="14"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />

                                <rect
                                    x="14"
                                    y="14"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />
                            </svg>

                        </div>

                        <div>
                            <h1 className="text-sm font-bold text-gray-900">
                                Employee
                            </h1>

                            <p className="text-xs text-gray-400">
                                Management System
                            </p>
                        </div>

                    </Link>

                    {/* CLOSE MOBILE */}
                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                        aria-label="Tutup sidebar"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                </div>


                {/* NAVIGATION */}
                <nav className="flex-1 space-y-1 px-4 py-6">

                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Menu Utama
                    </p>


                    {/* DASHBOARD */}
                    <Link
                        href="/dashboard"
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${isActive('/dashboard')
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="7"
                                height="7"
                                rx="1"
                            />

                            <rect
                                x="14"
                                y="3"
                                width="7"
                                height="7"
                                rx="1"
                            />

                            <rect
                                x="3"
                                y="14"
                                width="7"
                                height="7"
                                rx="1"
                            />

                            <rect
                                x="14"
                                y="14"
                                width="7"
                                height="7"
                                rx="1"
                            />
                        </svg>

                        <span>
                            Dashboard
                        </span>

                    </Link>


                    {/* KARYAWAN */}
                    <Link
                        href="/karyawan"
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${isActive('/karyawan')
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

                            <circle
                                cx="9"
                                cy="7"
                                r="4"
                            />

                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />

                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>

                        <span>
                            Data Karyawan
                        </span>

                    </Link>

                </nav>


                {/* USER AREA */}
                <div className="border-t border-gray-100 p-4">

                    {user && (
                        <div className="mb-3 rounded-xl bg-gray-50 p-3">

                            <div className="flex items-center gap-3">

                                {/* AVATAR */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                    {user.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>


                                {/* USER INFO */}
                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-gray-900">
                                        {user.username}
                                    </p>

                                    <p className="truncate text-xs text-gray-500">
                                        {user.email}
                                    </p>

                                </div>

                            </div>


                            {/* ROLE */}
                            <div className="mt-3">

                                <span
                                    className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${user.role ===
                                            'admin'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {user.role ===
                                        'admin'
                                        ? 'Administrator'
                                        : 'Editor'}
                                </span>

                            </div>

                        </div>
                    )}


                    {/* LOGOUT */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                            <polyline points="16 17 21 12 16 7" />

                            <line
                                x1="21"
                                y1="12"
                                x2="9"
                                y2="12"
                            />
                        </svg>

                        <span>
                            Keluar
                        </span>

                    </button>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}
            <div className="min-h-screen lg:pl-[270px]">

                {/* TOP BAR */}
                <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">

                    {/* MOBILE MENU BUTTON */}
                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50 lg:hidden"
                        aria-label="Buka menu"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line
                                x1="4"
                                y1="6"
                                x2="20"
                                y2="6"
                            />

                            <line
                                x1="4"
                                y1="12"
                                x2="20"
                                y2="12"
                            />

                            <line
                                x1="4"
                                y1="18"
                                x2="20"
                                y2="18"
                            />
                        </svg>
                    </button>


                    {/* PAGE TITLE */}
                    <div className="hidden lg:block">

                        <p className="text-sm font-medium text-gray-900">
                            {pathname ===
                                '/dashboard'
                                ? 'Dashboard'
                                : pathname.startsWith(
                                    '/karyawan'
                                )
                                    ? 'Data Karyawan'
                                    : 'Employee Management'}
                        </p>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="ml-auto flex items-center gap-3">

                        {user && (
                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-semibold text-gray-900">
                                    {user.username}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {user.role ===
                                        'admin'
                                        ? 'Administrator'
                                        : 'Editor'}
                                </p>

                            </div>
                        )}


                        {user && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                {user.username
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}

                    </div>

                </header>


                {/* CONTENT */}
                <main className="p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-[1400px]">
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
}