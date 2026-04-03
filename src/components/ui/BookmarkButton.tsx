'use client';

import { useEffect, useState } from 'react';
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
      className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
        bookmarked
          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
