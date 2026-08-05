'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TiptapEditor from '@/components/ui/TiptapEditor';

interface Category {
  id: number;
  name: string;
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [tags, setTags] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(res.data.data.path);
    } catch {
      setError('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/articles', {
        title,
        content,
        excerpt,
        category_id: parseInt(categoryId),
        cover_image: coverImage || undefined,
        is_premium: isPremium,
      });
      // Sync tags if provided
      const articleId = res.data.data?.id;
      if (articleId && tags.trim()) {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        await api.post(`/articles/${articleId}/tags`, { tags: tagList });
      }
      router.push('/dashboard/articles');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal membuat artikel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-tinta-900 mb-6">Tulis Artikel Baru</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Judul</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="kolom-isian" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Kategori</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="kolom-isian" required>
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleUploadCover} className="w-full text-sm text-tinta-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emas-50 file:text-emas-800 hover:file:bg-emas-100" />
          {uploading && <p className="text-sm text-tinta-500 mt-1">Mengupload...</p>}
          {coverImage && <p className="text-sm text-green-600 mt-1">Cover berhasil diupload</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Upload Karya PDF (opsional)</label>
          <input type="file" accept=".pdf" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploadingPdf(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
              const res = await api.post('/upload/pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
              setPdfFile(res.data.data.path);
            } catch { setError('Gagal upload PDF'); }
            finally { setUploadingPdf(false); }
          }} className="w-full text-sm text-tinta-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emas-50 file:text-emas-800 hover:file:bg-emas-100" />
          {uploadingPdf && <p className="text-sm text-tinta-500 mt-1">Mengupload PDF...</p>}
          {pdfFile && <p className="text-sm text-green-600 mt-1">PDF berhasil diupload</p>}
        </div>
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <input type="checkbox" id="premium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4 text-emas-700 rounded focus:ring-emas-600" />
          <label htmlFor="premium" className="text-sm">
            <span className="font-medium text-tinta-900">Artikel Premium</span>
            <span className="text-tinta-500 ml-1">- Hanya bisa dibaca oleh subscriber</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Tag</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="kolom-isian" placeholder="Pisahkan dengan koma: romantis, budaya, modern" />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Ringkasan</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="kolom-isian" placeholder="Ringkasan singkat artikel..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Konten</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-emas-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emas-800 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Draf'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-tinta-300 rounded-lg text-tinta-700 hover:bg-tinta-50">Batal</button>
        </div>
      </form>
    </div>
  );
}
