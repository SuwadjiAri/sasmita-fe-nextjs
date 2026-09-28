import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Eye, Lock, Flame } from 'lucide-react';
import ArticleCard, { type ArtikelKartu } from '@/components/ui/ArticleCard';
import BookCard from '@/components/ui/BookCard';
import { ambilJson } from '@/lib/server-fetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smita.id/api';

type Artikel = ArtikelKartu & {
  categoryId: number;
  viewCount?: number;
  content?: string;
  editorName?: string;
};

type Kategori = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

async function getArticles() {
  return ambilJson<{ data: Artikel[] }>(`${API}/articles?per_page=12`, {
    cache: 'no-store',
  });
}

async function getCategories() {
  return ambilJson<{ data: Kategori[] }>(`${API}/categories`, {
    cache: 'no-store',
  });
}

export default async function HomePage() {
  const [articlesRes, categoriesRes] = await Promise.all([getArticles(), getCategories()]);
  const articles: Artikel[] = articlesRes?.data || [];
  const categories: Kategori[] = categoriesRes?.data || [];

  const namaKategori = new Map(categories.map((k) => [k.id, k.name]));
  const slugKategori = new Map(categories.map((k) => [k.id, k.slug]));

  // Artikel utama untuk hero (Karya Baru Terbit paling atas)
  const featuredArticle = articles[0] || null;
  // 4 artikel terbit baru di samping hero
  const recentArticles = articles.slice(1, 5);

  // Filter artikel per jenis untuk seksi konten seperti kbm.id / goodnovel.com
  const novelArticles = articles.filter(a => slugKategori.get(a.categoryId) === 'novel');
  const cerpenPuisi = articles.filter(a => {
    const slug = slugKategori.get(a.categoryId);
    return slug === 'cerpen' || slug === 'puisi';
  });
  const opiniEsai = articles.filter(a => {
    const slug = slugKategori.get(a.categoryId);
    return slug === 'opini' || slug === 'esai' || slug === 'resensi';
  });

  const rubrikIcons: Record<string, string> = {
    opini: '💡',
    esai: '📝',
    cerpen: '📖',
    puisi: '🖋️',
    resensi: '📚',
    novel: '✨',
  };

  return (
    <div className="space-y-16 pb-16">
      {/* ── 1. HERO TOP SECTION: KARYA YANG BARU TERBIT (KBM.ID & GOODNOVEL STYLE) ── */}
      <section className="relative overflow-hidden bg-tinta-950 text-white pt-10 pb-16 sm:py-20 border-b border-white/10">
        <div
          className="absolute inset-0 opacity-[0.22] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 15%, #c08d3c 0, transparent 45%), radial-gradient(circle at 85% 10%, #3d587c 0, transparent 40%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emas-500/20 border border-emas-400/30 text-emas-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Rilis Terbaru Minggu Ini
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                Karya yang Baru Terbit
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-tinta-300 leading-relaxed">
                Jelajahi naskah sastra, opini, esai, cerpen, puisi, resensi, dan serial novel yang baru saja lolos kurasi resmi redaksi SMITA.ID.
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emas-400 hover:text-emas-300 transition-colors"
            >
              Lihat Semua Terbitan &rarr;
            </Link>
          </div>

          {/* Grid Showcase Baru Terbit (KBM / GoodNovel Inspired) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Spotlight Utama (Karya Unggulan Baru Terbit) */}
            {featuredArticle ? (
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/15 bg-white/[0.05] backdrop-blur-md p-6 sm:p-8 hover:border-emas-400/50 transition-all shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-start">
                  {/* Vertical 3D Book Cover */}
                  <div className="relative aspect-[2/3] w-full max-w-[180px] mx-auto sm:mx-0 rounded-2xl overflow-hidden shadow-2xl group">
                    {featuredArticle.coverImage ? (
                      <img
                        src={`${API}${featuredArticle.coverImage}`}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emas-800 via-tinta-900 to-tinta-950 flex flex-col items-center justify-center p-4 text-center">
                        <span className="font-serif text-4xl font-bold text-emas-300 mb-2">
                          {featuredArticle.title.charAt(0)}
                        </span>
                        <span className="text-[10px] text-emas-300/80 uppercase tracking-widest font-mono">
                          {namaKategori.get(featuredArticle.categoryId)}
                        </span>
                      </div>
                    )}
                    <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                    <div className="absolute top-2 right-2">
                      {featuredArticle.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emas-500 text-tinta-950 shadow">
                          <Lock className="w-2.5 h-2.5" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-600 text-white shadow">
                          Gratis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Spotlight */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emas-400/20 text-emas-300 border border-emas-400/30">
                          {namaKategori.get(featuredArticle.categoryId) || 'Sastra'}
                        </span>
                        <span className="text-xs text-tinta-400">
                          {featuredArticle.publishedAt
                            ? new Date(featuredArticle.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : ''}
                        </span>
                      </div>

                      <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white line-clamp-2 leading-snug">
                        {featuredArticle.title}
                      </h2>

                      <p className="mt-3 text-sm text-tinta-300 line-clamp-3 leading-relaxed">
                        {featuredArticle.excerpt || 'Baca naskah karya pilihan selengkapnya di portal sastra SMITA.ID.'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/articles/${featuredArticle.slug}`}
                        className="btn-emas px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                      >
                        <BookOpen className="w-4 h-4" />
                        Mulai Membaca Sekarang
                      </Link>

                      {typeof featuredArticle.viewCount === 'number' && (
                        <span className="inline-flex items-center gap-1 text-xs text-tinta-400">
                          <Eye className="w-3.5 h-3.5" /> {featuredArticle.viewCount} pembaca
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* List Top Baru Terbit (Kanan - 4 Karya) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emas-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" /> Terbitan Baru Terpopuler
                </span>
                <span className="text-xs text-tinta-400">Peringkat Rilis</span>
              </div>

              <div className="space-y-3">
                {recentArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl transition-all hover:bg-white/10 group"
                  >
                    {/* Rank Badge */}
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      idx === 0
                        ? 'bg-emas-500 text-tinta-950 font-bold'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900 font-bold'
                        : idx === 2
                        ? 'bg-amber-700 text-white font-bold'
                        : 'bg-white/10 text-tinta-300'
                    }`}>
                      {idx + 1}
                    </span>

                    {/* Mini Cover */}
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-tinta-900 shrink-0 shadow">
                      {art.coverImage ? (
                        <img src={`${API}${art.coverImage}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif text-sm font-bold text-emas-400">
                          {art.title.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-emas-400">
                          {namaKategori.get(art.categoryId)}
                        </span>
                        {art.isPremium && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emas-500/20 text-emas-300 font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white truncate group-hover:text-emas-300 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-xs text-tinta-400 truncate mt-0.5">
                        {art.excerpt || 'Baca naskah karya.'}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-tinta-500 group-hover:text-white transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK CATEGORY PILLS BAR (OPINI, ESAI, CERPEN, PUISI, RESENSI, NOVEL) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="rounded-2xl bg-white p-4 shadow-xl border border-tinta-200/80">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/search"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-tinta-950 text-white shrink-0 hover:bg-tinta-900 transition-colors flex items-center gap-1.5"
            >
              Semua Rubrik
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-4 py-2 rounded-xl text-sm font-medium text-tinta-700 hover:text-emas-800 hover:bg-emas-50/80 border border-tinta-200/60 transition-all shrink-0 flex items-center gap-2"
              >
                <span>{rubrikIcons[cat.slug] || '📚'}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SERIAL NOVEL & BACAAN PILIHAN (KBM.ID & GOODNOVEL STYLE) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emas-700">
              <BookOpen className="w-4 h-4" /> Serial Fiksi Panjang
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-tinta-900">
              Serial Novel & Karya Pilihan
            </h2>
            <p className="mt-1 text-sm text-tinta-600">
              Naskah cerita bersambung dengan bab episode yang nyaman dinikmati dalam mode baca novel imersif.
            </p>
          </div>

          <Link
            href="/categories/novel"
            className="text-sm font-semibold text-emas-700 hover:text-emas-800 transition-colors inline-flex items-center gap-1"
          >
            Lihat Rubrik Novel &rarr;
          </Link>
        </div>

        {novelArticles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {novelArticles.map((novel, idx) => (
              <BookCard
                key={novel.id}
                book={{
                  id: novel.id,
                  title: novel.title,
                  slug: novel.slug,
                  excerpt: novel.excerpt,
                  coverImage: novel.coverImage,
                  isPremium: novel.isPremium,
                  viewCount: novel.viewCount,
                  categoryName: 'Novel',
                }}
                rank={idx + 1}
              />
            ))}
            {/* Tambahan rekomendasi kartu bila karya novel masih 1 */}
            {articles.slice(1, 5).map((book, idx) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.title,
                  slug: book.slug,
                  excerpt: book.excerpt,
                  coverImage: book.coverImage,
                  isPremium: book.isPremium,
                  viewCount: book.viewCount,
                  categoryName: namaKategori.get(book.categoryId),
                }}
                rank={novelArticles.length + idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {articles.slice(0, 5).map((book, idx) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.title,
                  slug: book.slug,
                  excerpt: book.excerpt,
                  coverImage: book.coverImage,
                  isPremium: book.isPremium,
                  viewCount: book.viewCount,
                  categoryName: namaKategori.get(book.categoryId),
                }}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. CERPEN & PUISI SASTRA PILIHAN ── */}
      <section className="bg-latar/50 py-16 border-y border-tinta-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="label-mikro text-emas-700">Karya Sastra</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-tinta-900">
                Cerpen & Puisi Pilihan
              </h2>
              <p className="mt-1 text-sm text-tinta-600">
                Puitika bait dan untaian cerita pendek karya sastrawan mahasiswa dan umum.
              </p>
            </div>
            <Link href="/categories/cerpen" className="btn-garis text-sm">
              Lihat Kumpulan Cerpen & Puisi
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cerpenPuisi.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                label={namaKategori.get(art.categoryId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OPINI, ESAI & RESENSI KRITIS ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="label-mikro text-emas-700">Telaah & Wacana</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-tinta-900">
              Opini, Esai & Resensi Kritis
            </h2>
            <p className="mt-1 text-sm text-tinta-600">
              Wacana pemikiran, telaah kebudayaan, dan ulasan karya sastra Indonesia.
            </p>
          </div>
          <Link href="/categories/opini" className="btn-garis text-sm">
            Jelajahi Wacana & Esai
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opiniEsai.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              label={namaKategori.get(art.categoryId)}
            />
          ))}
        </div>
      </section>

      {/* ── 6. AJAKAN PENERBITAN (CALL TO ACTION) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-tinta-950 p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #c08d3c 0, transparent 60%)',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emas-500/20 text-emas-300 border border-emas-400/30">
              Ruang Berkarya Terbuka
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Siap Menerbitkan Naskah Anda?
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-tinta-300">
              Kirimkan puisi, cerpen, esai, opini, resensi, atau serial novel Anda untuk ditinjau oleh Dewan Redaksi SMITA.ID. Tulis sekarang dan bagikan karya Anda kepada ribuan pembaca.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-emas px-7 py-3 text-sm font-semibold flex items-center gap-2">
                Daftar Sebagai Penulis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="btn border border-white/20 text-white hover:bg-white/10 px-7 py-3 text-sm font-semibold"
              >
                Masuk ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
