'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trash2 } from 'lucide-react';

interface Category { id: number; name: string; slug: string; description?: string; }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => { api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {}); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/categories', { name, description });
    setName(''); setDescription(''); loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kategori ini?')) return;
    await api.post(`/admin/categories/${id}/delete`);
    loadCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Kategori</h1>

      {/* Form Tambah */}
      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Tambah Kategori</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi (opsional)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap">Tambah</button>
        </div>
      </form>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr><th className="text-left px-6 py-3">Nama</th><th className="text-left px-6 py-3">Slug</th><th className="text-left px-6 py-3">Deskripsi</th><th className="px-6 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{cat.description || '-'}</td>
                <td className="px-6 py-3 text-right"><button onClick={() => handleDelete(cat.id)} className="text-red-500 text-sm hover:underline">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.slug}</p>
              {cat.description && <p className="text-sm text-gray-500 mt-1">{cat.description}</p>}
            </div>
            <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
