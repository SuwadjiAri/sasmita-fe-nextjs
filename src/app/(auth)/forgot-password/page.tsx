'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      const msg = res.data?.message || 'Instruksi pemulihan kata sandi telah dikirim ke email Anda.';
      setSuccess(msg);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengirim permohonan pemulihan kata sandi. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kartu p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emas-100 text-emas-800">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-tinta-900">Lupa Kata Sandi</h1>
          <p className="text-xs text-tinta-500">Pemulihan akses akun portal SMITA.ID</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-tinta-600">
        {!isSubmitted
          ? 'Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan aman untuk membuat kata sandi baru Anda.'
          : 'Instruksi pemulihan kata sandi telah dikirimkan ke alamat email Anda.'}
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isSubmitted ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50/70 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">Email Pemulihan Terkirim</p>
                <p className="mt-1 text-xs text-green-800 leading-relaxed">
                  Tautan instruksi telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda, lalu klik tautan tersebut untuk mengatur kata sandi baru.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-tinta-50 p-3 text-xs text-tinta-600 space-y-1">
            <p>â€¢ Tautan pemulihan berlaku selama <strong>1 jam</strong>.</p>
            <p>â€¢ Jika email tidak ditemukan, tunggu beberapa menit lalu coba kirim ulang.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setSuccess('');
            }}
            className="w-full rounded-lg border border-tinta-200 py-2.5 text-sm font-medium text-tinta-700 hover:bg-tinta-100 transition-colors"
          >
            Kirim Ulang Permohonan
          </button>
        </div>
      ) : (
        <form onSubmit={handleRequestToken} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label-input">Alamat Email Terdaftar</label>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-utama w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Kirim Tautan Pemulihan</span>
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
