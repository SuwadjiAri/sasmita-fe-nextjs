'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export default function BookmarkButton({ articleId }: { articleId: number }) {
  const { user } = useAuthStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get(`/articles/${articleId}/bookmark`)
      .then((res) => setBookmarked(res.data.data.bookmarked))
      .catch(() => {});
  }, [articleId, user]);

  if (!user) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/articles/${articleId}/bookmark`);
      setBookmarked(res.data.data.bookmarked);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={bookmarked}
      className={`btn btn-kecil px-4 py-2 text-sm ${
        bookmarked
          ? 'border border-emas-300 bg-emas-50 text-emas-800 hover:bg-emas-100'
          : 'border border-tinta-300 bg-white text-tinta-700 hover:border-tinta-400 hover:bg-tinta-50'
      }`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Tersimpan' : 'Simpan'}
    </button>
  );
}
