'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Pencil } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

const statusLabel: Record<string, string> = {
  draft: 'Draf',
  pending: 'Menunggu Review',
  revision: 'Perlu Revisi',
  published: 'Terbit',
  archived: 'Arsip',
};

const statusColor: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  revision: 'bg-orange-100 text-orange-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
};

export default function MyArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my/articles')
      .then((res) => setArticles(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Karya Saya</h1>
        <Link
          href="/dashboard/articles/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          Tulis Baru
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : articles.length === 0 ? (
        <EmptyState icon="article" title="Belum ada artikel" description="Mulai menulis karya sastra anda dan bagikan ke dunia." actionLabel="Tulis Artikel Baru" actionHref="/dashboard/articles/create" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3">Judul</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[article.status] || ''}`}>
                        {statusLabel[article.status] || article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/articles/${article.id}/edit`} className="text-indigo-600 text-sm hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">{article.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[article.status] || ''}`}>
                      {statusLabel[article.status] || article.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/articles/${article.id}/edit`} className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
