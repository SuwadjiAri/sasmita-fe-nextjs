import Link from 'next/link';
import { BookOpen, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard, { type ArtikelKartu } from '@/components/ui/ArticleCard';
import BookCard from '@/components/ui/BookCard';
import { ambilJson } from '@/lib/server-fetch';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smita.id/api';
const PER_PAGE = 12;

type Kategori = { id: number; name: string; slug: string; description?: string };

type PaginationMeta = {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
};

async function getCategoryArticles(slug: string, page: number = 1, perPage: number = PER_PAGE) {
  const kategoriRes = await ambilJson<{ data: Kategori[] }>(`${API}/categories`, {
    cache: 'no-store',
  });

  const category = kategoriRes?.data?.find((c) => c.slug === slug) || null;
  if (!category) return { category: null, articles: [] as ArtikelKartu[], meta: null };

  const artikelRes = await ambilJson<{ data: ArtikelKartu[]; meta?: PaginationMeta }>(
    `${API}/articles?category_id=${category.id}&page=${page}&per_page=${perPage}`,
    { cache: 'no-store' }
  );

  const meta: PaginationMeta = artikelRes?.meta || {
    total: artikelRes?.data?.length || 0,
    page,
    per_page: perPage,
    last_page: 1,
  };

  return { category, articles: artikelRes?.data || [], meta };
}

function generatePageNumbers(current: number, last: number): (number | string)[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last];
  }
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last];
  }
  return [1, '...', current - 1, current, current + 1, '...', last];
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Math.max(1, parseInt(sParams?.page || '1', 10) || 1);
  const { category, articles, meta } = await getCategoryArticles(slug, currentPage, PER_PAGE);

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

  const totalKarya = meta?.total ?? articles.length;
  const totalHalaman = meta?.last_page ?? 1;
  const nomorHalaman = generatePageNumbers(currentPage, totalHalaman);
  const startIdx = totalKarya === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const endIdx = Math.min(currentPage * PER_PAGE, totalKarya);

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
            {totalKarya} karya terbit{totalHalaman > 1 ? ` · Halaman ${currentPage} dari ${totalHalaman}` : ''}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-tinta-300 px-6 py-20 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-tinta-300" />
            <p className="mt-4 text-lg font-semibold text-tinta-900">
              {totalKarya === 0 ? 'Belum ada karya' : 'Halaman tidak ditemukan'}
            </p>
            <p className="mt-1 text-tinta-500">
              {totalKarya === 0
                ? `Belum ada karya ${category.name.toLowerCase()} yang diterbitkan.`
                : `Halaman ${currentPage} belum memiliki karya. Silakan kembali ke halaman pertama.`}
            </p>
            <Link
              href={totalKarya === 0 ? '/dashboard/articles/create' : `/categories/${category.slug}`}
              className="btn-utama mt-6"
            >
              {totalKarya === 0 ? 'Tulis karya pertama' : 'Kembali ke halaman pertama'}
            </Link>
          </div>
        ) : category.slug === 'novel' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {articles.map((article, idx) => (
              <BookCard
                key={article.id}
                book={{
                  id: article.id,
                  title: article.title,
                  slug: article.slug,
                  excerpt: article.excerpt,
                  coverImage: article.coverImage,
                  isPremium: article.isPremium,
                  publishedAt: article.publishedAt,
                  categoryName: category.name,
                }}
                rank={startIdx + idx}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 stagger-children md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Bilah Navigasi Paginasi Halaman */}
        {totalHalaman > 1 && (
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-tinta-200/70 pt-8 sm:flex-row">
            <p className="text-sm text-tinta-500">
              Menampilkan <span className="font-semibold text-tinta-900">{startIdx}–{endIdx}</span> dari{' '}
              <span className="font-semibold text-tinta-900">{totalKarya}</span> karya
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1">
              {/* Tombol Halaman Sebelumnya */}
              {currentPage > 1 ? (
                <Link
                  href={`/categories/${category.slug}${currentPage - 1 > 1 ? `?page=${currentPage - 1}` : ''}`}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-tinta-200/80 bg-white px-3 text-sm font-medium text-tinta-700 transition-colors hover:border-emas-400 hover:bg-emas-50/50 hover:text-emas-700"
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Link>
              ) : (
                <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-xl border border-tinta-200/40 bg-tinta-50 px-3 text-sm font-medium text-tinta-300">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </span>
              )}

              {/* Angka Halaman */}
              <div className="flex items-center gap-1 mx-1">
                {nomorHalaman.map((p, idx) =>
                  typeof p === 'string' ? (
                    <span key={`dots-${idx}`} className="px-2 text-sm text-tinta-400">
                      ...
                    </span>
                  ) : p === currentPage ? (
                    <span
                      key={p}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-tinta-900 text-sm font-semibold text-white shadow-sm"
                      aria-current="page"
                    >
                      {p}
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={`/categories/${category.slug}${p > 1 ? `?page=${p}` : ''}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-tinta-200/80 bg-white text-sm font-medium text-tinta-700 transition-colors hover:border-emas-400 hover:bg-emas-50/50 hover:text-emas-700"
                    >
                      {p}
                    </Link>
                  )
                )}
              </div>

              {/* Tombol Halaman Selanjutnya */}
              {currentPage < totalHalaman ? (
                <Link
                  href={`/categories/${category.slug}?page=${currentPage + 1}`}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-tinta-200/80 bg-white px-3 text-sm font-medium text-tinta-700 transition-colors hover:border-emas-400 hover:bg-emas-50/50 hover:text-emas-700"
                  title="Halaman selanjutnya"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-xl border border-tinta-200/40 bg-tinta-50 px-3 text-sm font-medium text-tinta-300">
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
