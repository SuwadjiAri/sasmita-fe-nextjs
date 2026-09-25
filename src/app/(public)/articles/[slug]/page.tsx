import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, Lock } from 'lucide-react';
import ArticleContent from './ArticleContent';
import { ambilJson } from '@/lib/server-fetch';

interface Props {
  params: Promise<{ slug: string }>;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Artikel = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPremium: boolean;
  contentLocked?: boolean;
  publishedAt?: string;
  viewCount: number;
  editorId?: number;
  editorName?: string;
};

async function getArticle(slug: string) {
  const res = await ambilJson<{ data: Artikel }>(`${API}/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  return res?.data || null;
}

// Diambil terpisah karena endpoint artikel hanya memberi userId dan categoryId.
async function getPenulis(id?: number) {
  if (!id) return null;
  const res = await ambilJson<{
    data: { id: number; name: string; bio?: string; avatar?: string; created_at?: string };
  }>(`${API}/users/${id}`, { next: { revalidate: 3600 } });
  return res?.data || null;
}

async function getKategori(id?: number) {
  if (!id) return null;
  const res = await ambilJson<{ data: { id: number; name: string; slug: string }[] }>(
    `${API}/categories`,
    { next: { revalidate: 3600 } }
  );
  return res?.data?.find((k) => k.id === id) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Karya tidak ditemukan' };
  return {
    title: article.title,
    description: article.excerpt || article.title,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-tinta-900">Karya tidak ditemukan</h1>
        <p className="mt-2 text-tinta-600">
          Naskah yang Anda cari tidak ada, belum terbit, atau sudah dihapus.
        </p>
        <Link href="/" className="btn-utama mt-6">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const [penulis, kategori] = await Promise.all([
    getPenulis(article.userId),
    getKategori(article.categoryId),
  ]);

  const tanggal = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <article>
        <header className="mx-auto mb-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {kategori && (
              <Link href={`/categories/${kategori.slug}`} className="lencana bg-tinta-100 text-tinta-600 transition-colors hover:bg-tinta-200">
                {kategori.name}
              </Link>
            )}
            {article.isPremium && (
              <span className="lencana bg-emas-100 text-emas-800">
                <Lock className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-semibold leading-tight text-tinta-900 md:text-[2.75rem]">
            {article.title}
          </h1>

          {/* Saat isi dikunci, cuplikan di bawah sudah memuat excerpt ini juga. */}
          {article.excerpt && !article.contentLocked && (
            <p className="mt-5 font-serif text-lg leading-relaxed text-tinta-600">
              {article.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-tinta-200/70 pt-5 text-sm text-tinta-500">
            {penulis && (
              <>
                <Link
                  href={`/authors/${penulis.id}`}
                  className="font-medium text-tinta-800 transition-colors hover:text-emas-700"
                >
                  {penulis.name}
                </Link>
                <span className="text-tinta-300">/</span>
              </>
            )}
            <span className="inline-flex items-center gap-1">
              <span className="text-tinta-400">Editor:</span>
              <span className="font-medium text-tinta-800">
                {article.editorName || 'Redaksi SASMITA'}
              </span>
            </span>
            <span className="text-tinta-300">/</span>
            {tanggal && (
              <>
                <span>{tanggal}</span>
                <span className="text-tinta-300">/</span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {article.viewCount} pembaca
            </span>
          </div>
        </header>

        {article.coverImage && (
          <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-xl bg-tinta-100">
            <img src={`${API}${article.coverImage}`} alt="" className="w-full object-cover" />
          </div>
        )}

        <ArticleContent article={article} author={penulis} />
      </article>
    </div>
  );
}
