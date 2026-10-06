'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const router = useRouter();

    const [checking, setChecking] =
        useState(true);

    useEffect(() => {
        const token =
            localStorage.getItem('token');

        if (!token) {
            router.replace('/login');
            return;
        }

        setChecking(false);
    }, [router]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                    <p className="mt-4 text-sm font-medium text-gray-600">
                        Memeriksa autentikasi...
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Mohon tunggu sebentar
                    </p>

                </div>
            </div>
        );
    }

    return <>{children}</>;
}