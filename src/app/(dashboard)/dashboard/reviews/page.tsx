'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  isPremium: boolean;
  userId: number;
  createdAt: string;
}

export default function ReviewsPage() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });

  const loadReviews = (p: number, pp: number = 10) => {
    setLoading(true);
    api.get(`/redaksi/reviews?page=${p}&per_page=${pp}`).then((res) => {
      setArticles(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadReviews(1, perPage); }, []);

  const handlePageChange = (p: number) => { setPage(p); loadReviews(p, perPage); };
  const handlePerPageChange = (pp: number) => { setPerPage(pp); setPage(1); loadReviews(1, pp); };

  const handleReview = async (articleId: number, status: string) => {
    try {
      await api.post(`/redaksi/reviews/${articleId}`, {
        status,
        notes: reviewNotes[articleId] || '',
      });
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
      const msg = status === 'approved' ? 'Artikel disetujui' : status === 'revision_needed' ? 'Revisi diminta' : 'Artikel ditolak';
      toast.show(msg, status === 'approved' ? 'success' : 'info');
    } catch {
      toast.show('Gagal menyimpan review', 'error');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-tinta-900 mb-6">Review Artikel</h1>

      {loading ? (
        <LoadingSpinner message="Memuat review..." />
      ) : articles.length === 0 ? (
        <EmptyState icon="article" title="Tidak ada artikel menunggu review" description="Semua artikel sudah direview. Cek kembali nanti." />
      ) : (
        <>
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white border border-tinta-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-tinta-900 text-lg">{article.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-tinta-500">
                        Diajukan: {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {article.isPremium && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-sm text-tinta-600 mt-2 italic">&ldquo;{article.excerpt}&rdquo;</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emas-700 bg-emas-50 rounded-lg hover:bg-emas-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {expandedId === article.id ? 'Tutup' : 'Baca'}
                    {expandedId === article.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Content preview */}
              {expandedId === article.id && (
                <div className="border-t border-tinta-200/70 bg-tinta-50 px-5 py-4">
                  <div
                    className="prose prose-sm max-w-none max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              )}

              {/* Review actions */}
              <div className="border-t border-tinta-200/70 p-5 bg-tinta-50/50">
                <textarea
                  value={reviewNotes[article.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [article.id]: e.target.value })}
                  placeholder="Catatan untuk penulis (opsional)..."
                  rows={2}
                  className="w-full px-4 py-2 border border-tinta-200 rounded-lg text-sm focus:ring-2 focus:ring-emas-600 focus:border-transparent mb-3 resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleReview(article.id, 'approved')}
                    className="btn bg-green-700 text-white hover:bg-green-800"
                  >
                    Setujui & Publikasi
                  </button>
                  <button
                    onClick={() => handleReview(article.id, 'revision_needed')}
                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Minta Revisi
                  </button>
                  <button
                    onClick={() => handleReview(article.id, 'rejected')}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
      </>
      )}
    </div>
  );
}
