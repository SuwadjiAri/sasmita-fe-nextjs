'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ImageIcon, FileText, Trash2, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import TiptapEditor from '@/components/ui/TiptapEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const API = process.env.NEXT_PUBLIC_API_URL || '';

interface Category {
  id: number;
  name: string;
  slug?: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [serialStatus, setSerialStatus] = useState<'ongoing' | 'completed'>('completed');
  const [tags, setTags] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get(`/articles/${id}/tags`).catch(() => ({ data: { data: [] } })),
      // Ambil data artikel: coba endpoint spesifik id, fallback ke list karya
      api.get(`/my/articles/${id}`).catch(() =>
        api.get('/my/articles?per_page=100').then((res) => {
          const list = res.data.data || [];
          const found = list.find((a: { id: number }) => a.id === parseInt(id));
          return { data: { data: found } };
        })
      ),
    ])
      .then(([catRes, tagRes, artRes]) => {
        setCategories(catRes.data.data || []);
        const article = artRes.data?.data;
        if (article) {
          setTitle(article.title || '');
          setContent(article.content || '');
          setExcerpt(article.excerpt || '');
          setCategoryId(String(article.categoryId || article.category_id || ''));
          setIsPremium(article.isPremium || article.is_premium || false);
          setCoverImage(article.coverImage || article.cover_image || '');
          setPdfFile(article.pdfFile || article.pdf_file || '');
          setSerialStatus(article.serialStatus || article.serial_status || 'completed');
        }
        const existingTags = (tagRes.data.data || []).map((t: { name: string }) => t.name);
        setTags(existingTags.join(', '));
      })
      .catch(() => {
        setError('Gagal memuat data naskah karya');
      })
      .finally(() => setFetching(false));
  }, [id]);

  const selectedCat = categories.find((c) => String(c.id) === categoryId);
  const isNovel = selectedCat?.slug === 'novel' || selectedCat?.name.toLowerCase().includes('novel');
  const isOpiniOrEsai = ['opini', 'esai'].includes(selectedCat?.slug || '') ||
    selectedCat?.name.toLowerCase().includes('opini') ||
    selectedCat?.name.toLowerCase().includes('esai');

  const handleInsertChapter = () => {
    const existingChapters = (content.match(/<h[23][^>]*>(?:Bab|Bagian|\d+)[^<]*<\/h[23]>/gi) || []).length;
    const nextNum = existingChapters + 1;
    const template = `<h2>Bab ${nextNum}: Judul Bab</h2><p>Tuliskan naskah bab ${nextNum} di sini...</p>`;
    setContent((prev) => (prev ? `${prev}<hr/>${template}` : template));
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(res.data.data.path);
    } catch {
      setError('Gagal upload gambar sampul');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPdfFile(res.data.data.path);
    } catch {
      setError('Gagal upload file PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        title,
        content,
        excerpt,
        category_id: parseInt(categoryId),
        cover_image: coverImage || null,
        pdf_file: pdfFile || null,
        serial_status: isNovel ? serialStatus : 'completed',
      };
      await api.put(`/articles/${id}`, payload);
      if (tags.trim()) {
        const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
        await api.post(`/articles/${id}/tags`, { tags: tagList });
      }
      router.push('/dashboard/articles');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal memperbarui artikel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Memuat naskah karya..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-tinta-900 mb-6">Edit Naskah Karya</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Judul Karya</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="kolom-isian"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Kategori / Rubrik</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="kolom-isian"
            required
          >
            <option value="">Pilih kategori rubrik</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {isNovel && (
          <div className="rounded-xl border border-emas-300 bg-emas-50/60 p-4 space-y-2">
            <label className="block text-sm font-semibold text-tinta-900">Status Serial Novel</label>
            <p className="text-xs text-tinta-600 mb-2">
              Tentukan apakah novel masih aktif menulis bab baru atau naskah sudah tamat sepenuhnya.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="serialStatus"
                  value="ongoing"
                  checked={serialStatus === 'ongoing'}
                  onChange={() => setSerialStatus('ongoing')}
                  className="text-emas-600 focus:ring-emas-500"
                />
                <span className="font-semibold text-tinta-900">Masih Berjalan (Ongoing)</span>
                <span className="text-xs text-tinta-500">- Bab bertambah berkala</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="serialStatus"
                  value="completed"
                  checked={serialStatus === 'completed'}
                  onChange={() => setSerialStatus('completed')}
                  className="text-emas-600 focus:ring-emas-500"
                />
                <span className="font-semibold text-tinta-900">Tamat (Completed)</span>
                <span className="text-xs text-tinta-500">- Seluruh bab sudah lengkap</span>
              </label>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-tinta-200/80 bg-white p-4 space-y-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-tinta-800 mb-1">
              <ImageIcon className="h-4 w-4 text-emas-600" />
              <span>
                {isNovel
                  ? 'Sampul Novel / Cover Buku'
                  : isOpiniOrEsai
                  ? 'Gambar Sampul / Banner Opini & Esai (opsional)'
                  : 'Gambar Sampul / Cover Image (opsional)'}
              </span>
            </label>
            <p className="text-xs text-tinta-500 mb-2">
              {isNovel
                ? 'Disarankan gambar potret (rasio 3:4) untuk rak buku & pembaca novel ala smita.id.'
                : isOpiniOrEsai
                ? 'Gambar lanskap/horizontal sebagai ilustrasi tajuk artikel opini atau esai.'
                : 'Gambar sampul pembuka naskah karya.'}
            </p>

            {coverImage ? (
              <div className="flex items-start gap-4 p-3 bg-tinta-50 rounded-lg border border-tinta-200/70">
                <div
                  className={`overflow-hidden rounded-md border border-tinta-200 bg-white ${
                    isNovel ? 'aspect-[3/4] w-24' : 'aspect-[16/9] w-32'
                  }`}
                >
                  <img
                    src={`${API}${coverImage}`}
                    alt="Preview Sampul"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-xs font-medium text-green-700 flex items-center gap-1.5">
                    <span>✓</span> Sampul naskah terpasang
                  </p>
                  <p className="text-[11px] text-tinta-500 break-all">{coverImage}</p>
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 pt-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Ganti / Hapus Sampul
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadCover}
                className="w-full text-sm text-tinta-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emas-50 file:text-emas-800 hover:file:bg-emas-100"
              />
            )}
            {uploadingCover && <p className="text-xs text-tinta-500 mt-1">Mengunggah gambar sampul...</p>}
          </div>
        </div>

        <div className="rounded-xl border border-tinta-200/80 bg-white p-4 space-y-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-tinta-800 mb-1">
              <FileText className="h-4 w-4 text-emas-600" />
              <span>
                {isOpiniOrEsai
                  ? 'Naskah Lengkap PDF (opsional untuk Esai / Opini / Akademik)'
                  : isNovel
                  ? 'Manuskrip PDF Novel (opsional)'
                  : 'Naskah PDF (opsional)'}
              </span>
            </label>
            <p className="text-xs text-tinta-500 mb-2">
              {isOpiniOrEsai
                ? 'Lampirkan berkas dokumen naskah lengkap atau jurnal ilmiah format PDF untuk dapat dibaca/diunduh pembaca.'
                : isNovel
                ? 'Novel dibaca per bab melalui editor di bawah. Unggah PDF hanya jika ingin menyertakan salinan manuskrip cetak.'
                : 'Lampirkan salinan dokumen naskah format PDF.'}
            </p>

            {pdfFile ? (
              <div className="flex items-center justify-between p-3 bg-tinta-50 rounded-lg border border-tinta-200/70">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="h-5 w-5 text-emas-700 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-green-700">✓ Dokumen PDF tersimpan</p>
                    <p className="text-[11px] text-tinta-500 truncate max-w-xs">{pdfFile.split('/').pop()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={`${API}${pdfFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emas-700 hover:text-emas-800 font-medium inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Buka
                  </a>
                  <button
                    type="button"
                    onClick={() => setPdfFile('')}
                    className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Ganti / Hapus
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept=".pdf"
                onChange={handleUploadPdf}
                className="w-full text-sm text-tinta-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emas-50 file:text-emas-800 hover:file:bg-emas-100"
              />
            )}
            {uploadingPdf && <p className="text-xs text-tinta-500 mt-1">Mengunggah dokumen PDF...</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Tag</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="kolom-isian"
            placeholder="Pisahkan dengan koma: romantis, budaya, modern"
          />
        </div>

        <div className="rounded-xl border border-tinta-200/70 bg-tinta-50 p-4 text-xs text-tinta-600 flex items-start gap-2.5">
          <span className="text-base leading-none">ℹ️</span>
          <span>
            <strong>Status Akses Karya:</strong> Status akses naskah saat ini:{' '}
            <span className="font-semibold text-emas-800">
              {isPremium ? '⭐ Karya Premium (Khusus Pelanggan)' : '🔓 Karya Terbuka (Gratis)'}
            </span>
            . Penetapan atau perubahan status akses dilakukan oleh Tim Redaksi melalui proses kurasi di{' '}
            <span className="font-semibold text-emas-800">/dashboard/reviews</span> atau melalui tombol toggle di daftar karya.
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-tinta-700 mb-1">Ringkasan / Sinopsis</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="kolom-isian"
            placeholder={
              isNovel
                ? 'Sinopsis singkat novel...'
                : 'Ringkasan singkat naskah opini atau esai...'
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-tinta-700">
              {isNovel ? 'Isi Naskah Serial Novel' : 'Konten Naskah'}
            </label>
            {isNovel && (
              <span className="text-xs font-mono text-tinta-500">
                {content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} kata (~1.000 kata/bab ideal)
              </span>
            )}
          </div>

          {isNovel && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-800">📖 Panduan Serial:</span>
                <span>Gunakan format &ldquo;Bab 1: Judul&rdquo; agar sistem otomatis membagi naskah per episode pembaca.</span>
              </div>
              <button
                type="button"
                onClick={handleInsertChapter}
                className="px-3 py-1.5 bg-emas-700 hover:bg-emas-800 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-1"
              >
                <span>➕ Sisipkan Bab Baru</span>
              </button>
            </div>
          )}

          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emas-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emas-800 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-tinta-300 rounded-lg text-tinta-700 hover:bg-tinta-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
