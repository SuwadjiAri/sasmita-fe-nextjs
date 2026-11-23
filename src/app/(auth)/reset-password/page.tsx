'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { KeyRound, CheckCircle, ArrowLeft, Lock } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlToken = searchParams.get('token') || '';
  const urlEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(urlEmail);
  const [token, setToken] = useState(urlToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !token.trim()) {
      setError('Email dan token pemulihan tidak boleh kosong');
      return;
    }

    if (password.length < 8) {
      setError('Kata sandi baru minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        token: token.trim(),
        password,
      });

      const msg = res.data?.message || 'Kata sandi berhasil diperbarui! Silakan masuk.';
      setSuccess(msg);

      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengatur ulang kata sandi. Pastikan token masih berlaku.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kartu p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emas-100 text-emas-800">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-tinta-900">Buat Kata Sandi Baru</h1>
          <p className="text-xs text-tinta-500">Tetapkan kredensial baru untuk akun Anda</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-tinta-600">
        Silakan masukkan kata sandi baru yang kuat (minimal 8 karakter kombinasi huruf dan angka).
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50/70 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">Kata Sandi Berhasil Diperbarui!</p>
                <p className="mt-1 text-xs text-green-800 leading-relaxed">
                  {success} Anda akan dialihkan otomatis ke halaman login dalam beberapa detik.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="btn-utama block w-full py-2.5 text-center text-sm"
          >
            Masuk Sekarang
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!urlEmail && (
            <div>
              <label htmlFor="email" className="label-input">Alamat Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="kolom-isian"
                placeholder="nama@email.com"
                required
              />
            </div>
          )}

          {!urlToken && (
            <div>
              <label htmlFor="token" className="label-input">Token Pemulihan</label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="kolom-isian"
                placeholder="Tempel token yang diterima di email"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="label-input">Kata Sandi Baru</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="kolom-isian pr-10"
                placeholder="Minimal 8 karakter"
                required
                minLength={8}
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-tinta-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label-input">Ulangi Kata Sandi Baru</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="kolom-isian pr-10"
                placeholder="Ketik ulang kata sandi di atas"
                required
                minLength={8}
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-tinta-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-utama w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Kata Sandi Baru</span>
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-emas-700 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke halaman masuk</span>
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="kartu p-8 text-center text-sm text-tinta-500">
          Memuat formulir pemulihan kata sandi...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
