'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  userId: number;
  createdAt: string;
}

export default function ReviewsPage() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    api.get('/redaksi/reviews').then((res) => setArticles(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Artikel</h1>

      {loading ? (
        <LoadingSpinner message="Memuat review..." />
      ) : articles.length === 0 ? (
        <EmptyState icon="article" title="Tidak ada artikel menunggu review" description="Semua artikel sudah direview. Cek kembali nanti." />
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Diajukan: {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{article.excerpt}&rdquo;</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {expandedId === article.id ? 'Tutup' : 'Baca'}
                    {expandedId === article.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Content preview */}
              {expandedId === article.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <div
                    className="prose prose-sm max-w-none max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              )}

              {/* Review actions */}
              <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                <textarea
                  value={reviewNotes[article.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [article.id]: e.target.value })}
                  placeholder="Catatan untuk penulis (opsional)..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3 resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleReview(article.id, 'approved')}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
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
      )}
    </div>
  );
}
