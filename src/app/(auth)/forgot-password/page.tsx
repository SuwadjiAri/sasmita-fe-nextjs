'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.data?.token) {
        setToken(res.data.data.token);
        setStep('reset');
        setSuccess('Token berhasil dibuat. Silakan masukkan kata sandi baru.');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengirim permintaan';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, token, password });
      setSuccess('Kata sandi berhasil diganti. Silakan masuk.');
      setStep('email');
      setEmail('');
      setToken('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengganti kata sandi';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kartu p-8">
      <h1 className="text-2xl font-semibold text-tinta-900">Lupa Kata Sandi</h1>
      <p className="mt-1.5 text-tinta-500">
        {step === 'email'
          ? 'Masukkan email akun Anda untuk memulai penggantian.'
          : 'Masukkan kata sandi baru Anda.'}
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-6 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">
          {success}
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={handleRequestToken} className="mt-6 space-y-4">
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

          <button type="submit" disabled={loading} className="btn-utama w-full py-3">
            {loading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="label-input">Kata Sandi Baru</label>
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

          <div>
            <label htmlFor="confirmPassword" className="label-input">Ulangi Kata Sandi</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="kolom-isian"
              required
              minLength={8}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-utama w-full py-3">
            {loading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-emas-700 hover:underline">
          Kembali ke halaman masuk
        </Link>
      </p>
    </div>
  );
}
