import {
    NextRequest,
    NextResponse,
} from 'next/server';

import pool from '@/lib/database';

import {
    authenticateRequest,
    hasRole,
} from '@/lib/auth';

import {
    Karyawan,
    KaryawanForm,
} from '@/types/karyawan';


// ============================================================
// GET SEMUA KARYAWAN
// ============================================================

export async function GET(
    request: NextRequest
) {

    try {

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        const user =
            authenticateRequest(request);


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Token tidak valid atau tidak ditemukan',
                },
                {
                    status: 401,
                }
            );

        }


        // ------------------------------------------------------
        // ROLE
        // ------------------------------------------------------

        if (
            !hasRole(
                user,
                ['editor', 'admin']
            )
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Anda tidak memiliki akses',
                },
                {
                    status: 403,
                }
            );

        }


        // ------------------------------------------------------
        // QUERY
        // ------------------------------------------------------

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id_karyawan,
                    nama,
                    email,
                    no_telepon,
                    jenis_kelamin,
                    jabatan,
                    departemen,
                    alamat,
                    tanggal_masuk,
                    status,
                    created_at,
                    updated_at
                FROM karyawan
                ORDER BY id_karyawan DESC
                `
            );


        const data =
            rows as Karyawan[];


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        return NextResponse.json(
            {
                success: true,
                message: 'Data karyawan berhasil diambil',
                data,
            },
            {
                status: 200,
            }
        );


    } catch (error) {

        console.error(
            'ERROR GET KARYAWAN:',
            error
        );


        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengambil data karyawan',
            },
            {
                status: 500,
            }
        );

    }

}


// ============================================================
// POST KARYAWAN
// ============================================================

export async function POST(
    request: NextRequest
) {

    try {

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        const user =
            authenticateRequest(request);


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Token tidak valid atau tidak ditemukan',
                },
                {
                    status: 401,
                }
            );

        }


        // ------------------------------------------------------
        // ADMIN ONLY
        // ------------------------------------------------------

        if (
            !hasRole(
                user,
                ['admin']
            )
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Hanya admin yang dapat menambahkan karyawan',
                },
                {
                    status: 403,
                }
            );

        }


        // ------------------------------------------------------
        // REQUEST BODY
        // ------------------------------------------------------

        const body:
            KaryawanForm =
            await request.json();


        const {
            nama,
            email,
            no_telepon,
            jenis_kelamin,
            jabatan,
            departemen,
            alamat,
            tanggal_masuk,
            status,
        } = body;


        // ------------------------------------------------------
        // VALIDASI
        // ------------------------------------------------------

        if (
            !nama ||
            !email ||
            !jenis_kelamin ||
            !jabatan ||
            !departemen ||
            !tanggal_masuk
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Field wajib harus diisi',
                },
                {
                    status: 400,
                }
            );

        }


        // ------------------------------------------------------
        // INSERT
        // ------------------------------------------------------

        const [result] =
            await pool.execute(
                `
                INSERT INTO karyawan
                (
                    nama,
                    email,
                    no_telepon,
                    jenis_kelamin,
                    jabatan,
                    departemen,
                    alamat,
                    tanggal_masuk,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    nama,
                    email,
                    no_telepon || null,
                    jenis_kelamin,
                    jabatan,
                    departemen,
                    alamat || null,
                    tanggal_masuk,
                    status || 'Aktif',
                ]
            );


        const insertResult =
            result as {
                insertId: number;
            };


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        return NextResponse.json(
            {
                success: true,
                message:
                    'Data karyawan berhasil ditambahkan',
                id_karyawan:
                    insertResult.insertId,
            },
            {
                status: 201,
            }
        );


    } catch (error: unknown) {

        console.error(
            'ERROR CREATE KARYAWAN:',
            error
        );


        // ------------------------------------------------------
        // DUPLICATE EMAIL
        // ------------------------------------------------------

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'ER_DUP_ENTRY'
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Email karyawan sudah digunakan',
                },
                {
                    status: 409,
                }
            );

        }


        return NextResponse.json(
            {
                success: false,
                message:
                    'Gagal menambahkan karyawan',
            },
            {
                status: 500,
            }
        );

    }

}