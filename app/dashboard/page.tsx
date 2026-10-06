'use client';

import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';

interface DepartmentData {
    departemen: string;
    total: number;
}

interface DashboardData {
    totalKaryawan: number;
    karyawanAktif: number;
    karyawanNonaktif: number;
    departemen: DepartmentData[];
}

interface DashboardResponse {
    success: boolean;
    message: string;
    data?: DashboardData;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: DepartmentData;
    }>;
}

const chartColors = [
    '#111827',
    '#374151',
    '#4B5563',
    '#6B7280',
    '#9CA3AF',
    '#1F2937',
    '#374151',
];

function CustomTooltip({
    active,
    payload,
}: CustomTooltipProps) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const item = payload[0];

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl">
            <p className="text-xs font-medium text-gray-500">
                Departemen
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
                {item.payload.departemen}
            </p>

            <div className="mt-2 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-900" />

                <p className="text-sm text-gray-600">
                    {item.value} karyawan
                </p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token =
                    localStorage.getItem('token');

                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch(
                    '/api/dashboard/stats',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result: DashboardResponse =
                    await response.json();

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    window.location.href = '/login';
                    return;
                }

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                            'Gagal mengambil data dashboard'
                    );
                }

                setData(result.data || null);
            } catch (error) {
                console.error(
                    'ERROR DASHBOARD:',
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan saat mengambil data'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                    <p className="mt-4 text-sm text-gray-500">
                        Memuat dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        !
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-red-700">
                            Gagal Memuat Dashboard
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                    Data dashboard tidak tersedia.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50/50">

            <div className="space-y-6">

                {/* ================= HEADER ================= */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Overview
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Pantau kondisi dan distribusi karyawan perusahaan.
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                        <p className="text-xs text-gray-400">
                            Total Departemen
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-gray-900">
                            {data.departemen.length}
                        </p>
                    </div>
                </div>


                {/* ================= STATISTIC CARDS ================= */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {/* TOTAL */}
                    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Karyawan
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                                    {data.totalKaryawan}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    Seluruh karyawan terdaftar
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                    </div>


                    {/* AKTIF */}
                    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Karyawan Aktif
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
                                    {data.karyawanAktif}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    Sedang aktif bekerja
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{
                                    width: `${
                                        data.totalKaryawan
                                            ? (data.karyawanAktif /
                                                  data.totalKaryawan) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            />
                        </div>
                    </div>


                    {/* NONAKTIF */}
                    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 xl:col-span-1">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Karyawan Nonaktif
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-red-600">
                                    {data.karyawanNonaktif}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    Tidak aktif bekerja
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />
                                    <path d="m15 9-6 6" />
                                    <path d="m9 9 6 6" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-red-500"
                                style={{
                                    width: `${
                                        data.totalKaryawan
                                            ? (data.karyawanNonaktif /
                                                  data.totalKaryawan) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            />
                        </div>
                    </div>

                </div>


                {/* ================= CHART ================= */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <div>
                            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                Karyawan Berdasarkan Departemen
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Distribusi karyawan pada setiap departemen.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-lg bg-gray-50 px-3 py-2">
                            <span className="h-2 w-2 rounded-full bg-gray-900" />

                            <span className="text-xs font-medium text-gray-600">
                                Jumlah Karyawan
                            </span>
                        </div>

                    </div>


                    <div className="px-3 pb-6 pt-6 sm:px-6">

                        <div className="h-[320px] w-full sm:h-[360px]">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={data.departemen}
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: -15,
                                        bottom: 5,
                                    }}
                                    barCategoryGap="28%"
                                >

                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#E5E7EB"
                                        strokeDasharray="4 4"
                                    />

                                    <XAxis
                                        dataKey="departemen"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#6B7280',
                                            fontSize: 12,
                                        }}
                                        dy={10}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        tick={{
                                            fill: '#9CA3AF',
                                            fontSize: 12,
                                        }}
                                    />

                                    <Tooltip
                                        cursor={{
                                            fill: '#F9FAFB',
                                        }}
                                        content={
                                            <CustomTooltip />
                                        }
                                    />

                                    <Bar
                                        dataKey="total"
                                        name="Jumlah Karyawan"
                                        radius={[
                                            8,
                                            8,
                                            0,
                                            0,
                                        ]}
                                        maxBarSize={58}
                                        animationDuration={1000}
                                    >
                                        {data.departemen.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <Cell
                                                    key={
                                                        item.departemen
                                                    }
                                                    fill={
                                                        chartColors[
                                                            index %
                                                                chartColors.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>

                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>


                {/* ================= DEPARTMENT TABLE ================= */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                    Ringkasan Departemen
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Jumlah karyawan berdasarkan departemen.
                                </p>
                            </div>

                            <div className="hidden rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 sm:block">
                                {data.totalKaryawan} Karyawan
                            </div>

                        </div>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[500px] text-left">

                            <thead className="bg-gray-50/80">

                                <tr>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
                                        No
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
                                        Departemen
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
                                        Jumlah
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
                                        Persentase
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {data.departemen.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const percentage =
                                            data.totalKaryawan
                                                ? (
                                                      (item.total /
                                                          data.totalKaryawan) *
                                                      100
                                                  ).toFixed(
                                                      1
                                                  )
                                                : '0';

                                        return (
                                            <tr
                                                key={
                                                    item.departemen
                                                }
                                                className="transition-colors hover:bg-gray-50"
                                            >

                                                <td className="px-5 py-4 text-sm text-gray-400 sm:px-6">
                                                    {String(
                                                        index +
                                                            1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 sm:px-6">

                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className="h-2.5 w-2.5 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    chartColors[
                                                                        index %
                                                                            chartColors.length
                                                                    ],
                                                            }}
                                                        />

                                                        <span className="text-sm font-medium text-gray-900">
                                                            {
                                                                item.departemen
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-4 text-sm font-semibold text-gray-900 sm:px-6">
                                                    {item.total}
                                                </td>

                                                <td className="px-5 py-4 sm:px-6">

                                                    <div className="flex min-w-[150px] items-center gap-3">

                                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">

                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                    backgroundColor:
                                                                        chartColors[
                                                                            index %
                                                                                chartColors.length
                                                                        ],
                                                                }}
                                                            />

                                                        </div>

                                                        <span className="w-10 text-right text-xs font-medium text-gray-500">
                                                            {
                                                                percentage
                                                            }
                                                            %
                                                        </span>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </div>
    );
}