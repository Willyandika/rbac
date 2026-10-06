import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import pool from '@/lib/database';
import { generateToken } from '@/lib/auth';

import {
    User,
    LoginRequest,
    LoginResponse,
} from '@/types/user';


export async function POST(
    request: NextRequest
) {

    try {

        const body: LoginRequest =
            await request.json();

        const {
            email,
            password,
        } = body;


        // =====================================================
        // VALIDASI
        // =====================================================

        if (!email || !password) {

            const response: LoginResponse = {
                success: false,
                message: 'Email dan password wajib diisi',
            };

            return NextResponse.json(
                response,
                { status: 400 }
            );

        }


        // =====================================================
        // CARI USER
        // =====================================================

        const [rows] = await pool.execute(
            `
            SELECT
                id,
                username,
                email,
                password,
                role
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );


        const users = rows as Array<
            User & {
                password: string;
            }
        >;


        if (users.length === 0) {

            const response: LoginResponse = {
                success: false,
                message: 'Email atau password salah',
            };

            return NextResponse.json(
                response,
                { status: 401 }
            );

        }


        const databaseUser = users[0];


        // =====================================================
        // CEK PASSWORD
        // =====================================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                databaseUser.password
            );


        if (!passwordMatch) {

            const response: LoginResponse = {
                success: false,
                message: 'Email atau password salah',
            };

            return NextResponse.json(
                response,
                { status: 401 }
            );

        }


        // =====================================================
        // USER TANPA PASSWORD
        // =====================================================

        const user: User = {
            id: databaseUser.id,
            username: databaseUser.username,
            email: databaseUser.email,
            role: databaseUser.role,
        };


        // =====================================================
        // JWT
        // =====================================================

        const token = generateToken(user);


        // =====================================================
        // RESPONSE
        // =====================================================

        const response: LoginResponse = {
            success: true,
            message: 'Login berhasil',
            token,
            user,
        };


        return NextResponse.json(
            response,
            { status: 200 }
        );


    } catch (error) {

        console.error(
            'ERROR LOGIN:',
            error
        );


        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan pada server',
            },
            {
                status: 500,
            }
        );

    }

}