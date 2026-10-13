'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  FileText, Search, Filter, CheckCircle, Clock,
  AlertCircle, Archive, Trash2, Pencil, ExternalLink,
  Eye, Star, Sparkles, RefreshCw
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

const API = process.env.NEXT_PUBLIC_API_URL || '';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: 'draft' | 'pending' | 'revision' | 'published' | 'archived';
  isPremium: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
  serialStatus?: string;
  authorName?: string;
  categoryName?: string;
  categorySlug?: string;
}

interface ArticleStats {
  total: number;
  published: number;
  pending: number;
  draft: number;
  revision: number;
  archived: number;
  premium: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  draft: { label: 'Draf', color: 'text-tinta-600', bg: 'bg-tinta-100', icon: FileText },
  pending: { label: 'Menunggu Review', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  revision: { label: 'Perlu Revisi', color: 'text-orange-700', bg: 'bg-orange-100', icon: AlertCircle },
  published: { label: 'Terbit', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  archived: { label: 'Arsip', color: 'text-red-700', bg: 'bg-red-100', icon: Archive },
};

export default function AdminArticlesPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ArticleStats>({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0,
    revision: 0,
    archived: 0,
    premium: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Filter & Pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });

  // Load Kategori
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
  }, []);

  // Load Artikel
  const loadArticles = useCallback(
    (targetPage = page, targetPerPage = perPage) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(targetPage),
        per_page: String(targetPerPage),
      });

      if (categoryFilter) params.append('category_id', categoryFilter);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      api.get(`/admin/articles?${params.toString()}`)
        .then((res) => {
          setArticles(res.data.data || []);
          if (res.data.meta) setMeta(res.data.meta);
          if (res.data.stats) setStats(res.data.stats);
        })
        .catch(() => {
          toast.show('Gagal memuat data konten artikel', 'error');
        })
        .finally(() => setLoading(false));
    },
    [page, perPage, categoryFilter, statusFilter, search, toast]
  );

  useEffect(() => {
    loadArticles(1, perPage);
    setPage(1);
  }, [categoryFilter, statusFilter]);

  // Debounced search trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadArticles(1, perPage);
  };

  // Toggle Premium
  const handleTogglePremium = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/redaksi/articles/${id}/toggle-premium`, {});
      const newStatus = res.data.data?.isPremium;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isPremium: newStatus } : a))
      );
      setStats((prev) => ({
        ...prev,
        premium: newStatus ? prev.premium + 1 : Math.max(0, prev.premium - 1),
      }));
      toast.show(
        `Karya berhasil diubah menjadi ${newStatus ? 'PREMIUM (Berbayar)' : 'GRATIS'}`,
        'success'
      );
    } catch {
      toast.show('Gagal mengubah status premium karya', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/articles/${id}/status`, { status: newStatus });
      toast.show(`Status naskah berhasil diubah menjadi "${statusConfig[newStatus]?.label || newStatus}"`, 'success');
      loadArticles(page, perPage);
    } catch {
      toast.show('Gagal memperbarui status naskah', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Hapus Artikel
  const handleDelete = (id: number, title: string) => {
    confirm.show({
      title: 'Hapus Naskah Konten',
      message: `Apakah Anda yakin ingin menghapus naskah "${title}"? Seluruh data komentar dan statistik artikel ini akan ikut terhapus secara permanen.`,
      confirmLabel: 'Ya, Hapus Konten',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/articles/${id}`);
          toast.show('Naskah konten berhasil dihapus', 'success');
          loadArticles(page, perPage);
        } catch {
          toast.show('Gagal menghapus naskah konten', 'error');
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="label-mikro">Panel Administrasi</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emas-50 text-emas-700">
              <FileText className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-tinta-900">Kelola Konten</h1>
          </div>
          <p className="text-sm text-tinta-500 mt-1">
            Moderasi, kurasi, dan kelola seluruh karya sastra, opini, esai, dan serial novel di platform smita.id.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/articles/create"
            className="btn-utama text-xs py-2 px-3.5 inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>➕ Tulis Karya Baru</span>
          </Link>
          <button
            onClick={() => loadArticles(page, perPage)}
            disabled={loading}
            className="btn-garis text-xs py-2 px-3 inline-flex items-center gap-1.5"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Baris Ringkasan Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-tinta-200/70 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-tinta-500 text-xs font-medium mb-1">
            <span>Total Semua Karya</span>
            <FileText className="h-4 w-4 text-tinta-400" />
          </div>
          <p className="text-2xl font-bold text-tinta-900 font-mono">{stats.total}</p>
          <p className="text-[11px] text-tinta-400 mt-0.5">Seluruh karya terdaftar</p>
        </div>

        <div className="bg-white border border-tinta-200/70 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-green-700 text-xs font-medium mb-1">
            <span>Konten Terbit</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 font-mono">{stats.published}</p>
          <p className="text-[11px] text-green-600 mt-0.5">Live & dapat dibaca publik</p>
        </div>

        <div className="bg-white border border-tinta-200/70 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-yellow-700 text-xs font-medium mb-1">
            <span>Menunggu Review</span>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700 font-mono">{stats.pending}</p>
          <p className="text-[11px] text-yellow-600 mt-0.5">Butuh peninjauan kurator</p>
        </div>

        <div className="bg-white border border-tinta-200/70 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-emas-700 text-xs font-medium mb-1">
            <span>Konten Premium</span>
            <Star className="h-4 w-4 text-emas-500 fill-emas-500" />
          </div>
          <p className="text-2xl font-bold text-emas-700 font-mono">{stats.premium}</p>
          <p className="text-[11px] text-emas-600 mt-0.5">Akses berbayar berlangganan</p>
        </div>
      </div>

      {/* Filter & Pencarian */}
      <div className="bg-white border border-tinta-200/80 rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          {/* Kolom Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tinta-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul naskah atau nama penulis..."
              className="kolom-isian pl-9 text-sm w-full"
            />
          </div>

          {/* Filter Kategori */}
          <div className="w-full md:w-52">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="kolom-isian text-sm w-full cursor-pointer"
            >
              <option value="">Semua Rubrik</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="w-full md:w-52">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="kolom-isian text-sm w-full cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit (Published)</option>
              <option value="pending">Menunggu Review</option>
              <option value="draft">Draf</option>
              <option value="revision">Perlu Revisi</option>
              <option value="archived">Arsip</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-utama text-sm py-2 px-4 w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-1.5"
          >
            <Filter className="h-4 w-4" /> Cari
          </button>
        </form>
      </div>

      {/* Tabel Konten Artikel */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white border border-tinta-200/70">
          <LoadingSpinner />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl bg-white border border-tinta-200/70 p-8 text-center space-y-4">
          <EmptyState
            icon="search"
            title="Tidak Ada Konten Ditemukan"
            description="Belum ada karya yang cocok dengan kata kunci pencarian atau filter yang dipilih."
          />
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
              setStatusFilter('all');
            }}
            className="btn-garis text-xs py-2 px-4"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-tinta-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-tinta-700">
              <thead className="border-b border-tinta-200 bg-tinta-50/60 text-xs uppercase tracking-wider text-tinta-500">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Sampul</th>
                  <th scope="col" className="px-4 py-3.5">Judul & Rubrik</th>
                  <th scope="col" className="px-4 py-3.5">Penulis</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Akses</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Pembaca</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tinta-100">
                {articles.map((article) => {
                  const statusInfo = statusConfig[article.status] || statusConfig.draft;
                  const isUpdating = actionLoading === article.id;

                  return (
                    <tr key={article.id} className="hover:bg-tinta-50/50 transition-colors">
                      {/* Sampul Rasio 4:5 */}
                      <td className="px-4 py-3 align-top">
                        <div className="relative aspect-[4/5] w-14 overflow-hidden rounded-md border border-tinta-200 bg-tinta-100 shrink-0 shadow-sm">
                          {article.coverImage ? (
                            <img
                              src={`${API}${article.coverImage}`}
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-tinta-400 text-center p-1">
                              Tanpa Sampul
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Judul, Excerpt & Rubrik */}
                      <td className="px-4 py-3 align-top min-w-[240px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block rounded bg-tinta-100 px-2 py-0.5 text-[10px] font-semibold text-tinta-700 uppercase">
                              {article.categoryName || 'Sastra'}
                            </span>
                            {article.serialStatus && article.categorySlug === 'novel' && (
                              <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                article.serialStatus === 'ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {article.serialStatus === 'ongoing' ? 'Serial Berjalan' : 'Tamat'}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif font-semibold text-tinta-900 hover:text-emas-700 transition-colors inline-flex items-center gap-1.5 group"
                          >
                            <span>{article.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emas-600" />
                          </Link>

                          {article.excerpt && (
                            <p className="text-xs text-tinta-500 line-clamp-2 leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Penulis */}
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tinta-900 font-serif text-xs font-semibold text-emas-300">
                            {article.authorName ? article.authorName.charAt(0).toUpperCase() : 'P'}
                          </span>
                          <span className="font-medium text-tinta-900 text-xs">
                            {article.authorName || 'Penulis Portal'}
                          </span>
                        </div>
                        <p className="text-[10px] text-tinta-400 mt-1 pl-9">
                          ID: #{article.id}
                        </p>
                      </td>

                      {/* Status Kurasi & Selector Cepat */}
                      <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            <statusInfo.icon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>

                          {/* Selector Cepat Status oleh Admin */}
                          <select
                            value={article.status}
                            disabled={isUpdating}
                            onChange={(e) => handleUpdateStatus(article.id, e.target.value)}
                            className="text-[11px] rounded border border-tinta-200 bg-white px-2 py-0.5 text-tinta-700 hover:border-emas-500 focus:outline-none cursor-pointer"
                          >
                            <option value="published">Set Terbit</option>
                            <option value="pending">Set Menunggu</option>
                            <option value="draft">Set Draf</option>
                            <option value="revision">Set Revisi</option>
                            <option value="archived">Set Arsip</option>
                          </select>
                        </div>
                      </td>

                      {/* Status Akses (Gratis / Premium) */}
                      <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePremium(article.id)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                            article.isPremium
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                              : 'bg-tinta-100 text-tinta-600 hover:bg-tinta-200'
                          }`}
                          title="Klik untuk ubah status Gratis / Premium"
                        >
                          <Star className={`h-3 w-3 ${article.isPremium ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{article.isPremium ? '⭐ Premium' : 'Gratis'}</span>
                        </button>
                      </td>

                      {/* Pembaca & Tanggal */}
                      <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-xs text-tinta-600">
                          <Eye className="h-3.5 w-3.5 text-tinta-400" />
                          <span className="font-mono font-semibold">{article.viewCount}</span>
                        </div>
                        <p className="text-[10px] text-tinta-400 mt-1">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('id-ID') : 'Belum terbit'}
                        </p>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/articles/${article.id}/edit`}
                            className="p-1.5 rounded-lg text-tinta-600 hover:bg-tinta-100 hover:text-tinta-900 transition-colors"
                            title="Edit Naskah Lengkap"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(article.id, article.title)}
                            disabled={isUpdating}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Hapus Naskah"
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

          {/* Navigasi Paginasi */}
          <div className="p-4 border-t border-tinta-200/70">
            <Pagination
              page={page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={perPage}
              onPageChange={(p) => {
                setPage(p);
                loadArticles(p, perPage);
              }}
              onPerPageChange={(pp) => {
                setPerPage(pp);
                setPage(1);
                loadArticles(1, pp);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
