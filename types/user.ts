export type UserRole = 'admin' | 'editor';

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}