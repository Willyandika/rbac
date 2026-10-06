'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: number;
        username: string;
        email: string;
        role: 'admin' | 'editor';
    };
}

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                '/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const result: LoginResponse =
                await response.json();

            if (!response.ok || !result.success) {
                setError(
                    result.message ||
                        'Email atau password salah'
                );
                return;
            }

            if (!result.token || !result.user) {
                setError(
                    'Data login tidak lengkap'
                );
                return;
            }

            localStorage.setItem(
                'token',
                result.token
            );

            localStorage.setItem(
                'user',
                JSON.stringify(result.user)
            );

            router.push('/dashboard');
        } catch (error) {
            console.error(
                'ERROR LOGIN:',
                error
            );

            setError(
                'Tidak dapat terhubung ke server'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="rounded-2xl bg-white p-8 shadow-xl">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-2xl text-white">
                            👥
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            System Pengelola
                            Karyawan
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Silakan masuk ke akun
                            Anda
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Masukkan email"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Masukkan password"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? 'Memproses...'
                                : 'Login'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Employee Management
                    System
                </p>
            </div>
        </main>
    );
}