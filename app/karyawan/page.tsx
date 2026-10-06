'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Karyawan {
    id_karyawan: number;
    nama: string;
    email: string;
    no_telepon: string | null;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    jabatan: string;
    departemen: string;
    alamat: string | null;
    tanggal_masuk: string;
    status: 'Aktif' | 'Nonaktif';
}

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'editor';
}

export default function KaryawanPage() {
    const router = useRouter();

    const [karyawan, setKaryawan] =
        useState<Karyawan[]>([]);

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState('');

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

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

    const fetchKaryawan = async () => {
        try {
            setLoading(true);
            setError(null);

            const token =
                localStorage.getItem('token');

            if (!token) {
                router.replace('/login');
                return;
            }

            const response = await fetch(
                '/api/karyawan',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type':
                            'application/json',
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                router.replace('/login');
                return;
            }

            const contentType =
                response.headers.get(
                    'content-type'
                );

            if (
                !contentType?.includes(
                    'application/json'
                )
            ) {
                throw new Error(
                    'Server tidak mengembalikan data JSON.'
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Gagal mengambil data karyawan.'
                );
            }

            /*
             * API lama biasanya mengembalikan:
             * { success: true, data: [...] }
             *
             * Tetapi kode ini juga menangani jika
             * API langsung mengembalikan array.
             */
            if (Array.isArray(data)) {
                setKaryawan(data);
            } else if (
                Array.isArray(data.data)
            ) {
                setKaryawan(data.data);
            } else if (
                Array.isArray(data.karyawan)
            ) {
                setKaryawan(data.karyawan);
            } else {
                setKaryawan([]);
            }
        } catch (err) {
            console.error(
                'Karyawan error:',
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : 'Terjadi kesalahan saat memuat data karyawan.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKaryawan();
    }, []);

    const handleDelete = async (
        id: number,
        nama: string
    ) => {
        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menghapus data karyawan "${nama}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);

            const token =
                localStorage.getItem('token');

            if (!token) {
                router.replace('/login');
                return;
            }

            const response = await fetch(
                `/api/karyawan/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type':
                            'application/json',
                    },
                }
            );

            const data =
                await response.json();

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                router.replace('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Gagal menghapus data karyawan.'
                );
            }

            setKaryawan((current) =>
                current.filter(
                    (item) =>
                        item.id_karyawan !==
                        id
                )
            );

            window.alert(
                'Data karyawan berhasil dihapus.'
            );
        } catch (err) {
            console.error(
                'Delete error:',
                err
            );

            window.alert(
                err instanceof Error
                    ? err.message
                    : 'Gagal menghapus data karyawan.'
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filteredKaryawan =
        karyawan.filter((item) => {
            const keyword =
                search
                    .toLowerCase()
                    .trim();

            if (!keyword) {
                return true;
            }

            return (
                item.nama
                    .toLowerCase()
                    .includes(keyword) ||
                item.email
                    .toLowerCase()
                    .includes(keyword) ||
                item.jabatan
                    .toLowerCase()
                    .includes(keyword) ||
                item.departemen
                    .toLowerCase()
                    .includes(keyword) ||
                item.status
                    .toLowerCase()
                    .includes(keyword)
            );
        });

    const formatTanggal = (
        tanggal: string
    ) => {
        if (!tanggal) {
            return '-';
        }

        const date =
            new Date(tanggal);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return tanggal;
        }

        return date.toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }
        );
    };

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Data Karyawan
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Kelola seluruh data
                            karyawan dalam sistem.
                        </p>
                    </div>

                    {user?.role ===
                        'admin' && (
                        <Link
                            href="/karyawan/tambah"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>

                            Tambah Karyawan
                        </Link>
                    )}
                </div>

                {/* Statistik kecil */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Total
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {karyawan.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Aktif
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {
                                karyawan.filter(
                                    (item) =>
                                        item.status ===
                                        'Aktif'
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Nonaktif
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {
                                karyawan.filter(
                                    (item) =>
                                        item.status ===
                                        'Nonaktif'
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Main card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Daftar Karyawan
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Menampilkan{' '}
                                {
                                    filteredKaryawan.length
                                }{' '}
                                dari{' '}
                                {karyawan.length}{' '}
                                data.
                            </p>
                        </div>

                        <div className="relative w-full lg:max-w-sm">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Cari nama, email, jabatan..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                                <p className="mt-4 text-sm font-semibold text-gray-700">
                                    Memuat data
                                    karyawan...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {!loading &&
                        error && (
                            <div className="p-6">
                                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                                    <p className="font-semibold text-red-800">
                                        Gagal memuat
                                        data
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            fetchKaryawan
                                        }
                                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            </div>
                        )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        filteredKaryawan.length ===
                            0 && (
                            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-7 w-7 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={
                                                1.5
                                            }
                                            d="M20 13V7a2 2 0 00-2-2h-3.5l-1-1h-3l-1 1H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mt-4 font-semibold text-gray-900">
                                    {search
                                        ? 'Data tidak ditemukan'
                                        : 'Belum ada data karyawan'}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {search
                                        ? 'Coba gunakan kata kunci pencarian yang berbeda.'
                                        : 'Data karyawan belum tersedia di database.'}
                                </p>
                            </div>
                        )}

                    {/* Table */}
                    {!loading &&
                        !error &&
                        filteredKaryawan.length >
                            0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/70">
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                No
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Karyawan
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Kontak
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Jabatan
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Departemen
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Tanggal Masuk
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredKaryawan.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        item.id_karyawan
                                                    }
                                                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                                                >
                                                    {/* No */}
                                                    <td className="px-5 py-4 text-sm text-gray-500">
                                                        {index +
                                                            1}
                                                    </td>

                                                    {/* Karyawan */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                                                {item.nama
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-gray-900">
                                                                    {
                                                                        item.nama
                                                                    }
                                                                </p>

                                                                <p className="truncate text-xs text-gray-500">
                                                                    {
                                                                        item.jenis_kelamin
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Kontak */}
                                                    <td className="px-5 py-4">
                                                        <p className="max-w-[220px] truncate text-sm text-gray-700">
                                                            {
                                                                item.email
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {item.no_telepon ||
                                                                '-'}
                                                        </p>
                                                    </td>

                                                    {/* Jabatan */}
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {
                                                                item.jabatan
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Departemen */}
                                                    <td className="px-5 py-4">
                                                        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                                                            {
                                                                item.departemen
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Tanggal */}
                                                    <td className="px-5 py-4 text-sm text-gray-600">
                                                        {formatTanggal(
                                                            item.tanggal_masuk
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                item.status ===
                                                                'Aktif'
                                                                    ? 'bg-gray-900 text-white'
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    item.status ===
                                                                    'Aktif'
                                                                        ? 'bg-white'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            />

                                                            {
                                                                item.status
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {/* Lihat */}
                                                            <Link
                                                                href={`/karyawan/view/${item.id_karyawan}`}
                                                                title="Lihat detail"
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />

                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                            </Link>

                                                            {/* Edit */}
                                                            <Link
                                                                href={`/karyawan/edit/${item.id_karyawan}`}
                                                                title="Edit data"
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 7.5-7.5z"
                                                                    />
                                                                </svg>
                                                            </Link>

                                                            {/* Delete */}
                                                            <button
                                                                type="button"
                                                                title="Hapus data"
                                                                disabled={
                                                                    deletingId ===
                                                                    item.id_karyawan
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id_karyawan,
                                                                        item.nama
                                                                    )
                                                                }
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {deletingId ===
                                                                item.id_karyawan ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                                                                ) : (
                                                                    <svg
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>
            </div>
        </ProtectedRoute>
    );
}