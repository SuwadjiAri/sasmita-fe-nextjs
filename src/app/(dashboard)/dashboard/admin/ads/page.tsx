'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { Megaphone, MapPin, ToggleLeft, ToggleRight, Plus, Trash2, X, Pencil } from 'lucide-react';

interface AdPlacement { id: number; name: string; slotId?: string; imageUrl?: string; linkUrl?: string; position: string; isActive: boolean; }

const positionLabel: Record<string, string> = { header: 'Header', sidebar_left: 'Sidebar Kiri', sidebar_right: 'Sidebar Kanan', in_article: 'Dalam Artikel', footer: 'Footer' };

export default function AdminAdsPage() {
  const toast = useToast();
  const confirmDialog = useConfirm();
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('header');
  const [slotId, setSlotId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAds(); }, []);

  const loadAds = () => { api.get('/admin/ads').then((res) => setAds(res.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };

  const resetForm = () => {
    setName(''); setPosition('header'); setSlotId(''); setImageUrl(''); setLinkUrl('');
    setEditingId(null); setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (ad: AdPlacement) => {
    setEditingId(ad.id);
    setName(ad.name);
    setPosition(ad.position);
    setSlotId(ad.slotId || '');
    setImageUrl(ad.imageUrl || '');
    setLinkUrl(ad.linkUrl || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, position, slot_id: slotId || undefined, image_url: imageUrl || undefined, link_url: linkUrl || undefined };
      if (editingId) {
        await api.put(`/admin/ads/${editingId}`, payload);
        toast.show('Slot iklan berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/ads', payload);
        toast.show('Slot iklan berhasil ditambahkan', 'success');
      }
      resetForm();
      loadAds();
    } catch { toast.show(editingId ? 'Gagal memperbarui slot iklan' : 'Gagal menambahkan slot iklan', 'error'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (id: number, current: boolean) => {
    await api.put(`/admin/ads/${id}`, { is_active: !current });
    loadAds();
    toast.show(current ? 'Slot iklan dinonaktifkan' : 'Slot iklan diaktifkan', 'success');
  };

  const handleDelete = (id: number, adName: string) => {
    confirmDialog.show({
      title: 'Hapus Slot Iklan',
      message: `Apakah anda yakin ingin menghapus slot "${adName}"?`,
      confirmLabel: 'Ya, Hapus',
      type: 'danger',
      onConfirm: async () => {
        try { await api.delete(`/admin/ads/${id}`); loadAds(); toast.show('Slot iklan berhasil dihapus', 'success'); }
        catch { toast.show('Gagal menghapus slot iklan', 'error'); }
      },
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Slot Iklan</h1>
          <p className="text-gray-500 text-sm mt-1">{ads.length} slot iklan</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
            <Plus className="w-4 h-4" /> Tambah Slot
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Slot Iklan' : 'Tambah Slot Iklan'}</h2>
            </div>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama slot (misal: Header Banner)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="header">Header</option>
              <option value="sidebar_left">Sidebar Kiri</option>
              <option value="sidebar_right">Sidebar Kanan</option>
              <option value="in_article">Dalam Artikel</option>
              <option value="footer">Footer</option>
            </select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Banner</label>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                  setImageUrl(apiUrl + res.data.data.path);
                  toast.show('Gambar berhasil diupload', 'success');
                } catch { toast.show('Gagal upload gambar', 'error'); }
                finally { setUploading(false); }
              }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              {uploading && <p className="text-sm text-gray-500 mt-1">Mengupload...</p>}
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Preview" className="h-20 rounded-lg object-cover" />
                </div>
              )}
            </div>
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="URL Tujuan saat diklik (misal: https://example.com)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <input type="text" value={slotId} onChange={(e) => setSlotId(e.target.value)} placeholder="Slot ID / kode AdSense (opsional)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 whitespace-nowrap">
              {editingId ? (
                <>{saving ? 'Menyimpan...' : <><Pencil className="w-4 h-4" /> Simpan</>}</>
              ) : (
                <>{saving ? 'Menambah...' : <><Plus className="w-4 h-4" /> Tambah</>}</>
              )}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Memuat iklan..." />
      ) : ads.length === 0 ? (
        <EmptyState icon="article" title="Belum ada slot iklan" description="Tambahkan slot iklan untuk monetisasi platform." />
      ) : (
        <div className="space-y-3 stagger-children">
          {ads.map((ad) => (
            <div key={ad.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              {ad.imageUrl ? (
                <img src={ad.imageUrl} alt={ad.name} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ad.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Megaphone className={`w-5 h-5 ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{ad.name}</p>
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" /> {positionLabel[ad.position] || ad.position}
                  {ad.linkUrl && <span>· <a href={ad.linkUrl} target="_blank" rel="noopener" className="text-indigo-500 hover:underline">{ad.linkUrl.substring(0, 30)}...</a></span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(ad)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(ad.id, ad.isActive)} className={`p-2 rounded-xl transition-all ${ad.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {ad.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => handleDelete(ad.id, ad.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
