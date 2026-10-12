'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import {
  Award, Plus, Trash2, Pencil, ShieldCheck,
  BookOpen, Users, Mail, CheckCircle2, XCircle
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

export interface EditorialMember {
  id: number;
  section: 'penanggung_jawab' | 'pimpinan_redaksi' | 'dewan_redaksi' | 'tata_usaha';
  name: string;
  role_title?: string;
  roleTitle?: string;
  sub_rubrik?: string | null;
  subRubrik?: string | null;
  affiliation?: string | null;
  email?: string | null;
  sort_order?: number;
  sortOrder?: number;
  is_active?: boolean;
  isActive?: boolean;
}

const SECTION_OPTIONS = [
  { value: 'penanggung_jawab', label: '1. Penanggung Jawab' },
  { value: 'pimpinan_redaksi', label: '2. Pimpinan Redaksi' },
  { value: 'dewan_redaksi', label: '3. Dewan Redaksi' },
  { value: 'tata_usaha', label: '4. Tata Usaha & Kemitraan' },
];

export default function AdminEditorialPage() {
  const toast = useToast();
  const confirmDialog = useConfirm();

  const [members, setMembers] = useState<EditorialMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    section: 'dewan_redaksi' as EditorialMember['section'],
    name: '',
    role_title: '',
    sub_rubrik: '',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: '',
    sort_order: 0,
    is_active: true,
  });

  const loadMembers = () => {
    setLoading(true);
    api.get('/admin/editorial')
      .then((res) => {
        setMembers(res.data.data || []);
      })
      .catch(() => {
        toast.show('Gagal memuat susunan redaksi', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = (defaultSection?: EditorialMember['section']) => {
    setEditingId(null);
    setFormData({
      section: defaultSection || 'dewan_redaksi',
      name: '',
      role_title: '',
      sub_rubrik: '',
      affiliation: 'Sarana Media Informasi dan Sastra',
      email: '',
      sort_order: members.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: EditorialMember) => {
    setEditingId(item.id);
    setFormData({
      section: item.section,
      name: item.name,
      role_title: item.role_title || item.roleTitle || '',
      sub_rubrik: item.sub_rubrik || item.subRubrik || '',
      affiliation: item.affiliation || 'Sarana Media Informasi dan Sastra',
      email: item.email || '',
      sort_order: item.sort_order ?? item.sortOrder ?? 0,
      is_active: item.is_active ?? item.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role_title.trim()) {
      toast.show('Nama dan jabatan wajib diisi', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        section: formData.section,
        name: formData.name.trim(),
        role_title: formData.role_title.trim(),
        sub_rubrik: formData.sub_rubrik.trim() || null,
        affiliation: formData.affiliation.trim() || 'Sarana Media Informasi dan Sastra',
        email: formData.email.trim() || null,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active,
      };

      if (editingId) {
        await api.put(`/admin/editorial/${editingId}`, payload);
        toast.show('Anggota redaksi berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/editorial', payload);
        toast.show('Anggota redaksi berhasil ditambahkan', 'success');
      }

      setIsModalOpen(false);
      loadMembers();
    } catch {
      toast.show(editingId ? 'Gagal memperbarui data' : 'Gagal menambahkan data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    confirmDialog.show({
      title: 'Hapus Anggota Redaksi',
      message: `Apakah Anda yakin ingin menghapus "${name}" dari susunan redaksi?`,
      confirmLabel: 'Ya, Hapus',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/editorial/${id}`);
          toast.show('Anggota redaksi berhasil dihapus', 'success');
          loadMembers();
        } catch {
          toast.show('Gagal menghapus anggota redaksi', 'error');
        }
      },
    });
  };

  const filteredMembers = useMemo(() => {
    if (activeTab === 'all') return members;
    return members.filter((m) => m.section === activeTab);
  }, [members, activeTab]);

  const getSectionBadge = (section: string) => {
    switch (section) {
      case 'penanggung_jawab':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">1. Penanggung Jawab</span>;
      case 'pimpinan_redaksi':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">2. Pimpinan Redaksi</span>;
      case 'dewan_redaksi':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">3. Dewan Redaksi</span>;
      case 'tata_usaha':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">4. Tata Usaha & Kemitraan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-tinta-900 font-serif">
            Kelola Susunan Redaksi
          </h1>
          <p className="mt-1 text-sm text-tinta-600">
            Penataan dewan redaksi independen SMITA.ID di bawah Sarana Media Informasi dan Sastra.
          </p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emas-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emas-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Anggota
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-tinta-200/80 pb-3">
        {[
          { key: 'all', label: 'Semua Bagian', count: members.length },
          { key: 'penanggung_jawab', label: 'Penanggung Jawab', count: members.filter(m => m.section === 'penanggung_jawab').length },
          { key: 'pimpinan_redaksi', label: 'Pimpinan Redaksi', count: members.filter(m => m.section === 'pimpinan_redaksi').length },
          { key: 'dewan_redaksi', label: 'Dewan Redaksi', count: members.filter(m => m.section === 'dewan_redaksi').length },
          { key: 'tata_usaha', label: 'Tata Usaha & Kemitraan', count: members.filter(m => m.section === 'tata_usaha').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? 'bg-tinta-900 text-white shadow-xs'
                : 'bg-white text-tinta-600 hover:bg-tinta-100 hover:text-tinta-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-tinta-100 text-tinta-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Konten Daftar Anggota */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-tinta-300 px-6 py-16 text-center">
          <Award className="mx-auto h-10 w-10 text-tinta-300" />
          <h3 className="mt-4 text-lg font-semibold text-tinta-900">Belum ada anggota redaksi</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-tinta-500">
            Tambahkan susunan redaksi untuk bagian ini melalui tombol di bawah.
          </p>
          <button
            onClick={() => openAddModal(activeTab !== 'all' ? (activeTab as EditorialMember['section']) : undefined)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emas-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emas-700 transition"
          >
            <Plus className="h-4 w-4" /> Tambah Anggota Redaksi
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-tinta-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-tinta-700">
              <thead className="bg-tinta-50/75 border-b border-tinta-200 text-xs font-semibold uppercase tracking-wider text-tinta-600">
                <tr>
                  <th className="px-6 py-3.5">Urutan</th>
                  <th className="px-6 py-3.5">Nama & Gelar</th>
                  <th className="px-6 py-3.5">Jabatan / Rubrik</th>
                  <th className="px-6 py-3.5">Seksi Redaksi</th>
                  <th className="px-6 py-3.5">Afiliasi & Kontak</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tinta-100">
                {filteredMembers.map((item) => {
                  const role = item.role_title || item.roleTitle;
                  const rubrik = item.sub_rubrik || item.subRubrik;
                  const active = item.is_active ?? item.isActive ?? true;
                  const order = item.sort_order ?? item.sortOrder ?? 0;

                  return (
                    <tr key={item.id} className="hover:bg-tinta-50/50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-tinta-500 font-semibold">
                        #{order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-tinta-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-tinta-800">{role}</div>
                        {rubrik && (
                          <div className="mt-0.5 inline-flex items-center text-xs font-medium text-emas-800 bg-emas-50 px-2 py-0.5 rounded">
                            Rubrik: {rubrik}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getSectionBadge(item.section)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="text-tinta-600">{item.affiliation || 'Sarana Media Informasi dan Sastra'}</div>
                        {item.email && (
                          <div className="mt-0.5 flex items-center gap-1 text-tinta-500">
                            <Mail className="h-3 w-3" />
                            {item.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-tinta-500 bg-tinta-100 px-2 py-0.5 rounded-full">
                            <XCircle className="h-3 w-3" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="rounded-lg p-1.5 text-tinta-500 hover:bg-tinta-100 hover:text-tinta-900 transition"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-tinta-200">
            <h2 className="text-xl font-bold font-serif text-tinta-900">
              {editingId ? 'Edit Anggota Redaksi' : 'Tambah Anggota Redaksi'}
            </h2>
            <p className="mt-1 text-xs text-tinta-600">
              Isi data dewan redaksi independen Sarana Media Informasi dan Sastra.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                  Seksi Struktur Redaksi *
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value as EditorialMember['section'] })}
                  className="w-full rounded-xl border border-tinta-300 bg-white px-3.5 py-2.5 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none focus:ring-1 focus:ring-emas-500"
                >
                  {SECTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dr. Misbah Priagung Nursalim, S.S., M.Pd."
                  className="w-full rounded-xl border border-tinta-300 bg-white px-3.5 py-2.5 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none focus:ring-1 focus:ring-emas-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                  Jabatan / Peran Redaksional *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  placeholder="Contoh: Kurator Puisi, Editor Esai, Pemimpin Redaksi"
                  className="w-full rounded-xl border border-tinta-300 bg-white px-3.5 py-2.5 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none focus:ring-1 focus:ring-emas-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                  Rubrik / Bidang (Bisa Lebih dari 1 Orang per Rubrik)
                </label>
                <input
                  type="text"
                  value={formData.sub_rubrik}
                  onChange={(e) => setFormData({ ...formData, sub_rubrik: e.target.value })}
                  placeholder="Contoh: Puisi, Cerpen, Esai, Opini, Resensi, Novel"
                  className="w-full rounded-xl border border-tinta-300 bg-white px-3.5 py-2.5 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none focus:ring-1 focus:ring-emas-500"
                />
                <span className="text-[11px] text-tinta-500 mt-1 block">
                  Dewan redaksi dapat diisi beberapa kurator untuk rubrik yang sama.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                    Afiliasi Lembaga
                  </label>
                  <input
                    type="text"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="Sarana Media Informasi dan Sastra"
                    className="w-full rounded-xl border border-tinta-300 bg-white px-3 py-2 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                    Email Kontak (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="redaksi@smita.id"
                    className="w-full rounded-xl border border-tinta-300 bg-white px-3 py-2 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-tinta-300 bg-white px-3 py-2 text-sm text-tinta-900 focus:border-emas-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-tinta-300 text-emas-600 focus:ring-emas-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-tinta-800">
                    Status Aktif
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-tinta-200/80 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-tinta-300 px-4 py-2 text-sm font-medium text-tinta-700 hover:bg-tinta-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emas-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emas-700 transition disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
