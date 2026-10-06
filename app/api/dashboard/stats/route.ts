import {
    NextRequest,
    NextResponse,
} from 'next/server';

import pool from '@/lib/database';

import {
    authenticateRequest,
} from '@/lib/auth';


interface DepartmentStatistic {
    departemen: string;
    total: number;
}


export async function GET(
    request: NextRequest
) {

    try {

        // =====================================================
        // AUTH
        // =====================================================

        const user =
            authenticateRequest(request);


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Token tidak valid atau tidak ditemukan',
                },
                {
                    status: 401,
                }
            );

        }


        // =====================================================
        // TOTAL KARYAWAN
        // =====================================================

        const [
            totalResult,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS total
            FROM karyawan
            `
        );


        // =====================================================
        // AKTIF
        // =====================================================

        const [
            activeResult,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS total
            FROM karyawan
            WHERE status = 'Aktif'
            `
        );


        // =====================================================
        // NONAKTIF
        // =====================================================

        const [
            inactiveResult,
        ] = await pool.execute(
            `
            SELECT COUNT(*) AS total
            FROM karyawan
            WHERE status = 'Nonaktif'
            `
        );


        // =====================================================
        // DEPARTEMEN
        // =====================================================

        const [
            departmentResult,
        ] = await pool.execute(
            `
            SELECT
                departemen,
                COUNT(*) AS total
            FROM karyawan
            GROUP BY departemen
            ORDER BY total DESC
            `
        );


        const totalRows =
            totalResult as Array<{
                total: number;
            }>;


        const activeRows =
            activeResult as Array<{
                total: number;
            }>;


        const inactiveRows =
            inactiveResult as Array<{
                total: number;
            }>;


        const departmentRows =
            departmentResult as Array<{
                departemen: string;
                total: number;
            }>;


        const departemen:
            DepartmentStatistic[] =
            departmentRows.map(
                (item) => ({
                    departemen:
                        item.departemen,

                    total:
                        Number(item.total),
                })
            );


        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json(
            {
                success: true,

                message:
                    'Data dashboard berhasil diambil',

                data: {

                    totalKaryawan:
                        Number(
                            totalRows[0]?.total || 0
                        ),

                    karyawanAktif:
                        Number(
                            activeRows[0]?.total || 0
                        ),

                    karyawanNonaktif:
                        Number(
                            inactiveRows[0]?.total || 0
                        ),

                    departemen,

                },
            },
            {
                status: 200,
            }
        );


    } catch (error) {

        console.error(
            'ERROR DASHBOARD:',
            error
        );


        return NextResponse.json(
            {
                success: false,
                message:
                    'Gagal mengambil statistik dashboard',
            },
            {
                status: 500,
            }
        );

    }

}