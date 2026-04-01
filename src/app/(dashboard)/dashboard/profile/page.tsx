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
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-2xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Informasi Profil</h2>
        </div>
        {success && <div className="bg-green-600 text-white text-sm p-3 rounded-xl mb-4">{success}</div>}
        {error && <div className="bg-red-600 text-white text-sm p-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Ceritakan tentang diri anda..." />
          </div>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Ganti Password</h2>
        </div>
        {pwSuccess && <div className="bg-green-600 text-white text-sm p-3 rounded-xl mb-4">{pwSuccess}</div>}
        {pwError && <div className="bg-red-600 text-white text-sm p-3 rounded-xl mb-4">{pwError}</div>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required minLength={8} />
          </div>
          <button type="submit" disabled={pwLoading} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
            <Lock className="w-4 h-4" />
            {pwLoading ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
