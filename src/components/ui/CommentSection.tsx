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
    <div className="mt-12 border-t border-tinta-200 pt-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-tinta-900">
        <MessageCircle className="h-5 w-5 text-tinta-400" />
        Komentar ({comments.length})
      </h2>

      {/* Formulir komentar, atau ajakan masuk bila belum ada sesi. */}
      {!user ? (
        <div className="mb-8 rounded-xl border border-dashed border-tinta-300 px-6 py-10 text-center">
          <p className="font-medium text-tinta-800">Ingin berkomentar?</p>
          <p className="mt-1 text-sm text-tinta-500">
            Masuk untuk memberikan tanggapan pada karya ini.
          </p>
          <Link href="/login" className="btn-utama mt-5">
            <LogIn className="h-4 w-4" />
            Masuk
          </Link>
        </div>
      ) : (
        <div className="kartu mb-8 p-5">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tinta-900 font-serif text-sm font-semibold text-emas-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <form onSubmit={handleSubmit} className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="kolom-isian resize-none"
                placeholder="Tulis tanggapan Anda"
                aria-label="Tulis tanggapan"
                required
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="btn-utama btn-kecil px-5 py-2 text-sm"
                >
                  <Send className="h-3.5 w-3.5" />
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
          <p className="text-tinta-400 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="divide-y divide-tinta-100">
          {comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4 py-5 first:pt-0">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tinta-100 font-serif text-sm font-semibold text-tinta-700">
                {(comment.userName || 'A').charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <p className="text-sm font-semibold text-tinta-800">
                    {comment.userName || 'Anonim'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-tinta-400">
                    <Clock className="h-3 w-3" />
                    {comment.createdAt && new Date(comment.createdAt).getFullYear() > 1970
                      ? new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Baru saja'}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-tinta-700">{comment.content}</p>

                {user && user.id === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="mt-2 flex items-center gap-1 text-xs text-tinta-400 transition-colors hover:text-red-700 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
