'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registrasi gagal';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kartu p-8">
      <h1 className="text-2xl font-semibold text-tinta-900">Buat akun baru</h1>
      <p className="mt-1.5 text-tinta-500">Gratis, untuk menulis maupun membaca.</p>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="label-input">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="kolom-isian"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label-input">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="kolom-isian"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label-input">Kata Sandi</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="kolom-isian"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-utama w-full py-3">
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-tinta-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-emas-700 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
