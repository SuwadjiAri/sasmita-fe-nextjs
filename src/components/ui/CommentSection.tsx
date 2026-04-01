'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/components/ui/Toast';

interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const { user } = useAuthStore();
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/articles/${articleId}/comments`)
      .then((res) => setComments(res.data.data || []))
      .catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/articles/${articleId}/comments`, { content: newComment });
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment('');
    } catch {
      toast.show('Gagal mengirim komentar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.post(`/comments/${id}/delete`);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Komentar ({comments.length})</h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Tulis komentar..."
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm">{comment.content}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              {user && user.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
