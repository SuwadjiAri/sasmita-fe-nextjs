'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

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
    <div className="max-w-lg space-y-8">
      {/* Edit Profile */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profil</h1>
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Ceritakan tentang diri anda..." />
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ganti Password</h2>
        {pwSuccess && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{pwSuccess}</div>}
        {pwError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{pwError}</div>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required minLength={8} />
          </div>
          <button type="submit" disabled={pwLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
            {pwLoading ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
