'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BookOpen, ArrowRight } from 'lucide-react';

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <p className="text-gray-500 text-sm mt-1">{bookmarks.length} artikel disimpan</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat bookmark..." />
      ) : bookmarks.length === 0 ? (
        <EmptyState icon="bookmark" title="Belum ada bookmark" description="Simpan artikel favorit anda untuk dibaca nanti." actionLabel="Jelajahi Artikel" actionHref="/" />
      ) : (
        <div className="space-y-3 stagger-children">
          {bookmarks.map((bm) => (
            <Link key={bm.article.id} href={`/articles/${bm.article.slug}`} className="card-hover group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{bm.article.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{bm.article.excerpt || 'Baca selengkapnya...'}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-1 flex-shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
