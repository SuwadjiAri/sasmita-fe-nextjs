'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

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
        <p className="text-gray-500">Belum ada artikel. Mulai menulis sekarang!</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
      )}
    </div>
  );
}
