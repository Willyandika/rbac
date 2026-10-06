'use client';

import {
    FormEvent,
    useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
    LoginResponse,
} from '@/types/user';


export default function LoginPage() {

    const router = useRouter();


    const [email, setEmail] =
        useState<string>('');

    const [password, setPassword] =
        useState<string>('');

    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>('');


    // =========================================================
    // LOGIN
    // =========================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError('');
        setLoading(true);


        try {

            const response =
                await fetch(
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


            const data: LoginResponse =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Login gagal'
                );

            }


            // =================================================
            // SIMPAN TOKEN
            // =================================================

            if (data.token && data.user) {

                localStorage.setItem(
                    'token',
                    data.token
                );

                localStorage.setItem(
                    'user',
                    JSON.stringify(data.user)
                );

            }


            // =================================================
            // REDIRECT
            // =================================================

            router.push('/dashboard');

        } catch (error) {

            if (error instanceof Error) {

                setError(
                    error.message
                );

            } else {

                setError(
                    'Login gagal'
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">


                    {/* ICON */}

                    <div className="flex justify-center mb-5">

                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 2a4 4 0 100-8 4 4 0 000 8z"
                                />

                            </svg>

                        </div>

                    </div>


                    {/* TITLE */}

                    <div className="text-center mb-8">

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">

                            System Pengelola Karyawan

                        </h1>

                        <p className="text-gray-500 mt-2 text-sm">

                            Silakan login untuk melanjutkan

                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">

                            {error}

                        </div>

                    )}


                    {/* FORM */}

                    <form onSubmit={handleSubmit}>


                        {/* EMAIL */}

                        <div className="mb-5">

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Masukkan email"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="mb-6">

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Masukkan password"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                        >

                            {loading
                                ? 'Memproses...'
                                : 'Login'
                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}