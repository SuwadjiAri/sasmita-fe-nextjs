'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TiptapEditor from '@/components/ui/TiptapEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Category {
  id: number;
  name: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/my/articles'),
      api.get(`/articles/${id}/tags`),
    ]).then(([catRes, artRes, tagRes]) => {
      setCategories(catRes.data.data || []);
      const articles = artRes.data.data || [];
      const article = articles.find((a: { id: number }) => a.id === parseInt(id));
      if (article) {
        setTitle(article.title);
        setContent(article.content || '');
        setExcerpt(article.excerpt || '');
        setCategoryId(String(article.categoryId || article.category_id || ''));
        setIsPremium(article.isPremium || article.is_premium || false);
      }
      const existingTags = (tagRes.data.data || []).map((t: { name: string }) => t.name);
      setTags(existingTags.join(', '));
    }).catch(() => {}).finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.put(`/articles/${id}`, { title, content, excerpt, category_id: parseInt(categoryId), is_premium: isPremium });
      if (tags.trim()) {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        await api.post(`/articles/${id}/tags`, { tags: tagList });
      }
      router.push('/dashboard/articles');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal memperbarui artikel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Memuat artikel..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Artikel</h1>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required>
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Pisahkan dengan koma: romantis, budaya, modern" />
        </div>
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <input type="checkbox" id="premium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
          <label htmlFor="premium" className="text-sm">
            <span className="font-medium text-gray-900">Artikel Premium</span>
            <span className="text-gray-500 ml-1">— Hanya bisa dibaca oleh subscriber</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Batal</button>
        </div>
      </form>
    </div>
  );
}
