'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Pencil, Send, PenLine, Clock, CheckCircle, AlertCircle, Archive, Eye, Trash2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  viewCount: number;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  draft: { label: 'Draf', color: 'text-gray-600', bg: 'bg-gray-100', icon: PenLine },
  pending: { label: 'Menunggu Review', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  revision: { label: 'Perlu Revisi', color: 'text-orange-700', bg: 'bg-orange-100', icon: AlertCircle },
  published: { label: 'Terbit', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  archived: { label: 'Arsip', color: 'text-red-700', bg: 'bg-red-100', icon: Archive },
};

export default function MyArticlesPage() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });
  const [statusFilter, setStatusFilter] = useState('all');

  const loadArticles = (p: number = 1, pp: number = 10) => {
    setLoading(true);
    api.get(`/my/articles?page=${p}&per_page=${pp}`)
      .then((res) => {
        setArticles(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadArticles(1, perPage); }, []);

  const handlePageChange = (p: number) => { setPage(p); loadArticles(p, perPage); };
  const handlePerPageChange = (pp: number) => { setPerPage(pp); setPage(1); loadArticles(1, pp); };

  const filtered = statusFilter === 'all' ? articles : articles.filter(a => a.status === statusFilter);

  const handleSubmit = async (id: number) => {
    setSubmitting(id);
    try {
      await api.post(`/articles/${id}/submit`);
      toast.show('Artikel berhasil diajukan untuk review', 'success');
      loadArticles(page, perPage);
    } catch {
      toast.show('Gagal mengajukan artikel', 'error');
    } finally {
      setSubmitting(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.show('Artikel berhasil dihapus', 'success');
      loadArticles(page, perPage);
    } catch {
      toast.show('Gagal menghapus artikel', 'error');
    }
  };

  const canSubmit = (status: string) => status === 'draft' || status === 'revision';
  const canEdit = (status: string) => status !== 'published';
  const canDelete = (status: string) => status === 'draft' || status === 'revision';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Karya Saya</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.length} artikel</p>
        </div>
        <Link
          href="/dashboard/articles/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <PenLine className="w-4 h-4" />
          Tulis Baru
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'draft', label: 'Draf' },
          { key: 'pending', label: 'Pending' },
          { key: 'revision', label: 'Revisi' },
          { key: 'published', label: 'Terbit' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat artikel..." />
      ) : articles.length === 0 ? (
        <EmptyState icon="article" title="Belum ada artikel" description="Mulai menulis karya sastra anda dan bagikan ke dunia." actionLabel="Tulis Artikel Baru" actionHref="/dashboard/articles/create" />
      ) : (
        <>
        <div className="space-y-4 stagger-children">
          {filtered.map((article) => {
            const status = statusConfig[article.status] || statusConfig.draft;
            const StatusIcon = status.icon;

            return (
              <div key={article.id} className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{article.excerpt}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {article.status === 'published' && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <Eye className="w-3 h-3" /> {article.viewCount || 0} pembaca
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canSubmit(article.status) && (
                        <button
                          onClick={() => handleSubmit(article.id)}
                          disabled={submitting === article.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{submitting === article.id ? 'Mengajukan...' : 'Ajukan'}</span>
                        </button>
                      )}
                      {canEdit(article.status) && (
                        <Link
                          href={`/dashboard/articles/${article.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      )}
                      {canDelete(article.status) && (
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
      </>
      )}
    </div>
  );
}
