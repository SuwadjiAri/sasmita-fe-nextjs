'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { UserCircle, Lock, Save, Camera, Trash2 } from 'lucide-react';
import ImageCropperModal from '@/components/ui/ImageCropperModal';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProfilePage() {
  const { user, loadUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Krop foto profil state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropRawImage, setCropRawImage] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Ganti password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    setCropRawImage(tempUrl);
    setCropModalOpen(true);
    e.target.value = '';
  };

  const handleCropAvatarComplete = async (blob: Blob) => {
    setUploadingAvatar(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('file', blob, `avatar-${Date.now()}.jpg`);

    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newPath = res.data.data.path;
      setAvatar(newPath);
      await api.put('/me', { name, bio, avatar: newPath });
      await loadUser();
      setSuccess('Foto profil berhasil dikrop dan diperbarui');
    } catch {
      setError('Gagal mengunggah foto profil hasil krop');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/me', { name, bio, avatar: null });
      setAvatar('');
      await loadUser();
      setSuccess('Foto profil berhasil dihapus');
    } catch {
      setError('Gagal menghapus foto profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/me', { name, bio, avatar: avatar || null });
      await loadUser();
      setSuccess('Profil berhasil diperbarui');
    } catch {
      setError('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

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
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengubah password';
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Header Profil & Foto Avatar */}
      <div className="rounded-2xl border border-tinta-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative group self-start">
            {avatar ? (
              <img
                src={avatar.startsWith('http') || avatar.startsWith('blob:') ? avatar : `${API}${avatar}`}
                alt={user?.name}
                className="h-20 w-20 rounded-full object-cover border-2 border-emas-400 shadow-md"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-tinta-900 font-serif text-3xl font-semibold text-emas-300 shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-emas-400" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="label-mikro">Akun Pengguna</p>
                <h1 className="text-xl font-bold text-tinta-900">{user?.name}</h1>
                <p className="text-xs text-tinta-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <label className="btn-garis text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5 hover:border-emas-500 hover:text-emas-800">
                <Camera className="h-3.5 w-3.5 text-emas-700" />
                <span>{avatar ? 'Ganti Foto (1:1)' : 'Unggah Foto (1:1)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectAvatar}
                  className="hidden"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={loading || uploadingAvatar}
                  className="btn-garis text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 hover:border-red-200 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus Foto</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-tinta-400 pt-0.5">
              Format persegi rasio 1:1 dengan fitur krop presisi untuk tampilan dewan redaksi & kartu penulis.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profil Form */}
      <div className="bg-white border border-tinta-200/70 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <UserCircle className="w-5 h-5 text-emas-700" />
          <h2 className="font-semibold text-tinta-900">Informasi Profil</h2>
        </div>
        {success && <div className="mb-4 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">{success}</div>}
        {error && <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="kolom-isian"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Bio / Biodata Singkat</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="kolom-isian"
              placeholder="Ceritakan tentang latar belakang kepenulisan atau profil anda..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-utama">
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Ganti Password Form */}
      <div className="bg-white border border-tinta-200/70 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-emas-700" />
          <h2 className="font-semibold text-tinta-900">Ganti Password</h2>
        </div>
        {pwSuccess && <div className="mb-4 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">{pwSuccess}</div>}
        {pwError && <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{pwError}</div>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Password Lama</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="kolom-isian"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="kolom-isian"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta-700 mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="kolom-isian"
              required
              minLength={8}
            />
          </div>
          <button type="submit" disabled={pwLoading} className="btn-utama">
            <Lock className="w-4 h-4" />
            {pwLoading ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>

      {/* Modal Krop Avatar 1:1 */}
      <ImageCropperModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropRawImage}
        aspectRatio={1}
        aspectRatioLabel="1:1"
        cropShape="round"
        title="Krop Foto Profil (Rasio 1:1)"
        onCropComplete={handleCropAvatarComplete}
      />
    </div>
  );
}
