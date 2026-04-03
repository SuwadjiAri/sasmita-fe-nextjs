'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trash2, Plus, FolderOpen, Tag, Pencil } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

interface Category { id: number; name: string; slug: string; description?: string; }

export default function AdminCategoriesPage() {
  const toast = useToast();
  const confirmDialog = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => {
    api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const startEdit = (cat: Category) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setEditingId(cat.id);
  };

  const resetForm = () => { setName(''); setDescription(''); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, { name, description });
        toast.show('Kategori berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/categories', { name, description });
        toast.show('Kategori berhasil ditambahkan', 'success');
      }
      resetForm();
      loadCategories();
    } catch {
      toast.show(editingId ? 'Gagal memperbarui kategori' : 'Gagal menambahkan kategori', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: number, catName: string) => {
    confirmDialog.show({
      title: 'Hapus Kategori',
      message: `Apakah anda yakin ingin menghapus kategori "${catName}"? Artikel dalam kategori ini mungkin terpengaruh.`,
      confirmLabel: 'Ya, Hapus',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/categories/${id}`);
          loadCategories();
          toast.show('Kategori berhasil dihapus', 'success');
        } catch {
          toast.show('Gagal menghapus kategori', 'error');
        }
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} kategori</p>
      </div>

      {/* Form Tambah */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kategori"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi (opsional)"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Menyimpan...' : editingId ? 'Simpan' : 'Tambah'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      {loading ? (
        <LoadingSpinner message="Memuat kategori..." />
      ) : categories.length === 0 ? (
        <EmptyState icon="category" title="Belum ada kategori" description="Tambahkan kategori untuk mengorganisir artikel." />
      ) : (
        <div className="space-y-3 stagger-children">
          {categories.map((cat) => (
            <div key={cat.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{cat.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Tag className="w-3 h-3" />
                  {cat.slug}
                  {cat.description && <span>· {cat.description}</span>}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Hapus">
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
