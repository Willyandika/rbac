export type JenisKelamin =
    | 'Laki-laki'
    | 'Perempuan';

export type StatusKaryawan =
    | 'Aktif'
    | 'Nonaktif';


export interface Karyawan {
    id_karyawan: number;
    nama: string;
    email: string;
    no_telepon: string | null;
    jenis_kelamin: JenisKelamin;
    jabatan: string;
    departemen: string;
    alamat: string | null;
    tanggal_masuk: string;
    status: StatusKaryawan;
    created_at?: string;
    updated_at?: string;
}


export interface KaryawanForm {
    nama: string;
    email: string;
    no_telepon: string;
    jenis_kelamin: JenisKelamin;
    jabatan: string;
    departemen: string;
    alamat: string;
    tanggal_masuk: string;
    status: StatusKaryawan;
}