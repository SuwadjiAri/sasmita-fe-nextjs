'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { UserCircle, Lock, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, loadUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.put('/me', { name, bio });
      await loadUser();
      setSuccess('Profil berhasil diperbarui');
    } catch { setError('Gagal memperbarui profil'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');

    if (newPassword !== confirmPassword) {
      setPwError('Password baru tidak cocok');
      return;
    }

    setPwLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPwSuccess('Password berhasil diubah');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengubah password';
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Avatar header */}
      <div className="mb-2 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-tinta-900 font-serif text-2xl font-semibold text-emas-300">
          {user?.name?.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="label-mikro">Akun</p>
          <h1 className="mt-1 text-2xl font-semibold text-tinta-900">Ubah Profil</h1>
          <p className="text-sm text-tinta-500">{user?.email}</p>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white border border-tinta-200/70 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserCircle className="w-5 h-5 text-emas-700" />
          <h2 className="font-semibold text-tinta-900">Informasi Profil</h2>
        </div>
        {success && <div className="mb-4 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">{success}</div>}
        {error && <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Nama</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="kolom-isian" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="kolom-isian" placeholder="Ceritakan tentang diri anda..." />
          </div>
          <button type="submit" disabled={loading} className="btn-utama">
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-tinta-200/70 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-emas-700" />
          <h2 className="font-semibold text-tinta-900">Ganti Password</h2>
        </div>
        {pwSuccess && <div className="mb-4 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">{pwSuccess}</div>}
        {pwError && <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{pwError}</div>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Password Lama</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="kolom-isian" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Password Baru</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="kolom-isian" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Konfirmasi Password Baru</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="kolom-isian" required minLength={8} />
          </div>
          <button type="submit" disabled={pwLoading} className="btn-utama">
            <Lock className="w-4 h-4" />
            {pwLoading ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
