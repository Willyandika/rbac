import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '@/types/user';

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(
        user,
        process.env.JWT_SECRET as string,
        {
            expiresIn:
                (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'],
        }
    );
}

export function getTokenFromRequest(
    request: NextRequest
): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return null;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return null;
    }

    return token;
}

export function verifyToken(
    token: string
): AuthUser | null {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthUser;

        return decoded;
    } catch {
        return null;
    }
}

export function authenticateRequest(
    request: NextRequest
): AuthUser | null {
    const token = getTokenFromRequest(request);

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

export function hasRole(
    user: AuthUser,
    allowedRoles: UserRole[]
): boolean {
    return allowedRoles.includes(user.role);
}