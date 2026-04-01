'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

interface Article {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
}

export default function ReviewsPage() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/redaksi/reviews').then((res) => setArticles(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleReview = async (articleId: number, status: string, notes: string) => {
    try {
      await api.post(`/redaksi/reviews/${articleId}`, { status, notes });
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
    } catch { toast.show('Gagal menyimpan review', 'error'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Artikel</h1>
      {loading ? (<p className="text-gray-500">Memuat...</p>) : articles.length === 0 ? (<p className="text-gray-500">Tidak ada artikel yang menunggu review.</p>) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Diajukan: {new Date(article.createdAt).toLocaleDateString('id-ID')}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleReview(article.id, 'approved', '')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Setujui</button>
                <button onClick={() => { const notes = prompt('Catatan revisi:'); if (notes !== null) handleReview(article.id, 'revision_needed', notes); }} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600">Minta Revisi</button>
                <button onClick={() => { const notes = prompt('Alasan penolakan:'); if (notes !== null) handleReview(article.id, 'rejected', notes); }} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600">Tolak</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
