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
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
        bookmarked
          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
