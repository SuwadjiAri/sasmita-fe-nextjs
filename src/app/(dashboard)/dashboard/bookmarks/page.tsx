'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<{ article: { id: number; title: string; slug: string; excerpt?: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my/bookmarks')
      .then((res) => setBookmarks(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookmarks</h1>
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-500">Belum ada artikel yang di-bookmark.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => (
            <Link key={bm.article.id} href={`/articles/${bm.article.slug}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900">{bm.article.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{bm.article.excerpt || ''}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
