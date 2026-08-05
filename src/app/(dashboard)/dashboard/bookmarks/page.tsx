'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<{ article: { id: number; title: string; slug: string; excerpt?: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });

  const loadBookmarks = useCallback((p: number, pp: number = 10) => {
    setLoading(true);
    api.get(`/my/bookmarks?page=${p}&per_page=${pp}`)
      .then((res) => {
        setBookmarks(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadBookmarks(1, perPage); }, [loadBookmarks, perPage]);

  const handlePageChange = (p: number) => { setPage(p); loadBookmarks(p, perPage); };
  const handlePerPageChange = (pp: number) => { setPerPage(pp); setPage(1); loadBookmarks(1, pp); };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-tinta-900">Bookmarks</h1>
        <p className="text-tinta-500 text-sm mt-1">{meta.total} artikel disimpan</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat bookmark..." />
      ) : bookmarks.length === 0 ? (
        <EmptyState icon="bookmark" title="Belum ada bookmark" description="Simpan artikel favorit anda untuk dibaca nanti." actionLabel="Jelajahi Artikel" actionHref="/" />
      ) : (
        <>
          <div className="space-y-3 stagger-children">
            {bookmarks.map((bm) => (
              <Link key={bm.article.id} href={`/articles/${bm.article.slug}`} className="kartu-tautan group flex items-start gap-4 bg-white border border-tinta-200/70 rounded-xl p-5">
                <div className="w-10 h-10 bg-emas-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emas-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-emas-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-tinta-900 group-hover:text-emas-700 transition-colors">{bm.article.title}</h3>
                  <p className="text-tinta-500 text-sm mt-1 line-clamp-2">{bm.article.excerpt || 'Baca selengkapnya...'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-tinta-300 group-hover:text-emas-600 mt-1 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>

          <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
        </>
      )}
    </div>
  );
}
