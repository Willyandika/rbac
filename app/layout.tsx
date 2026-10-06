import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
    title: 'Employee Management System',
    description:
        'Sistem Manajemen Data Karyawan',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body>
                <Layout>
                    {children}
                </Layout>
            </body>
        </html>
    );
}