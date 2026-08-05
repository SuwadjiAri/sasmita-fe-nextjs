'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login gagal';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kartu p-8">
      <h1 className="text-2xl font-semibold text-tinta-900">Selamat datang kembali</h1>
      <p className="mt-1.5 text-tinta-500">Masuk ke akun SASMITA.COM Anda.</p>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="kolom-isian"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-utama w-full py-3">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-tinta-500">
        <p>
          <Link href="/forgot-password" className="text-emas-700 hover:underline">
            Lupa kata sandi?
          </Link>
        </p>
        <p>
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-emas-700 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
