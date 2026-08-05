import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import ArticleCard, { type ArtikelKartu } from '@/components/ui/ArticleCard';
import { ambilJson } from '@/lib/server-fetch';

interface Props {
  params: Promise<{ slug: string }>;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Kategori = { id: number; name: string; slug: string; description?: string };

async function getCategoryArticles(slug: string) {
  const kategoriRes = await ambilJson<{ data: Kategori[] }>(`${API}/categories`, {
    next: { revalidate: 3600 },
  });

  const category = kategoriRes?.data?.find((c) => c.slug === slug) || null;
  if (!category) return { category: null, articles: [] as ArtikelKartu[] };

  const artikelRes = await ambilJson<{ data: ArtikelKartu[] }>(
    `${API}/articles?category_id=${category.id}`,
    { next: { revalidate: 60 } }
  );

  return { category, articles: artikelRes?.data || [] };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const { category, articles } = await getCategoryArticles(slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-tinta-300" />
        <h1 className="mt-5 text-2xl font-semibold text-tinta-900">Kategori tidak ditemukan</h1>
        <p className="mt-2 text-tinta-600">Rubrik yang Anda cari tidak ada atau sudah dihapus.</p>
        <Link href="/categories" className="btn-utama mt-6">
          Lihat semua kategori
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-tinta-500 transition-colors hover:text-emas-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Semua Kategori
          </Link>

          <div className="mt-6 flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emas-50 font-serif text-3xl font-semibold text-emas-700">
              {category.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-tinta-900 md:text-4xl">{category.name}</h1>
              <p className="mt-2 max-w-2xl leading-relaxed text-tinta-600">
                {category.description || `Kumpulan karya ${category.name.toLowerCase()}.`}
              </p>
            </div>
          </div>

          <p className="label-mikro mt-8">
            {articles.length} karya terbit
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-tinta-300 px-6 py-20 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-tinta-300" />
            <p className="mt-4 text-lg font-semibold text-tinta-900">Belum ada karya</p>
            <p className="mt-1 text-tinta-500">
              Belum ada karya {category.name.toLowerCase()} yang diterbitkan.
            </p>
            <Link href="/dashboard/articles/create" className="btn-utama mt-6">
              Tulis karya pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 stagger-children md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
