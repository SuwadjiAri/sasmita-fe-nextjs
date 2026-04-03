'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { MessageCircle, LogIn, Send, Trash2, Clock } from 'lucide-react';

interface Comment {
  id: number;
  userId: number;
  content: string;
  userName?: string;
  createdAt: string;
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const { user } = useAuthStore();
  const toast = useToast();
  const confirmDialog = useConfirm();
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
      toast.show('Komentar berhasil dikirim', 'success');
    } catch {
      toast.show('Gagal mengirim komentar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    confirmDialog.show({
      title: 'Hapus Komentar',
      message: 'Apakah anda yakin ingin menghapus komentar ini?',
      confirmLabel: 'Ya, Hapus',
      type: 'danger',
      onConfirm: async () => {
        await api.delete(`/comments/${id}`);
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.show('Komentar berhasil dihapus', 'success');
      },
    });
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-indigo-600" />
        </div>
        Komentar ({comments.length})
      </h2>

      {/* Comment Form / Login Prompt */}
      {!user ? (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 mb-8 text-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MessageCircle className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="text-gray-700 font-medium mb-1">Ingin berkomentar?</p>
          <p className="text-gray-500 text-sm mb-4">Masuk untuk memberikan komentar pada artikel ini</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
            <LogIn className="w-4 h-4" />
            Masuk
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <form onSubmit={handleSubmit} className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                placeholder="Tulis komentar anda..."
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-white">
                  {(comment.userName || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 mb-1 px-1">{comment.userName || 'Anonim'}</p>
                <div className="bg-gray-50 rounded-2xl rounded-tl-md p-4">
                  <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5 px-1">
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {comment.createdAt && new Date(comment.createdAt).getFullYear() > 1970
                      ? new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Baru saja'}
                  </p>
                  {user && user.id === comment.userId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
