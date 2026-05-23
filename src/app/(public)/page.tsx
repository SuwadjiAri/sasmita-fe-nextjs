import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Sparkles } from 'lucide-react';

async function getArticles() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/articles?per_page=6`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

const categoryIcons: Record<string, string> = {
  puisi: '🎭',
  cerpen: '📖',
  esai: '📝',
  novel: '📚',
  resensi: '⭐',
  'artikel-akademik': '🎓',
};

export default async function HomePage() {
  const [articlesRes, categoriesRes] = await Promise.all([getArticles(), getCategories()]);
  const articles = articlesRes.data || [];
  const categories = categoriesRes.data || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm">
              <Sparkles className="w-4 h-4" />
              Platform Literasi Digital
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Tulis, Baca, dan Bagikan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                Karya Sastra Terbaik
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              SASMITA.COM — tempat menulis, menerbitkan, dan berbagi
              puisi, cerpen, esai, dan karya akademik
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 hover:shadow-xl hover:shadow-white/20 transition-all"
              >
                Jelajahi Karya
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Mulai Menulis
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16">
            {[
              { icon: BookOpen, label: 'Kategori', value: categories.length },
              { icon: Users, label: 'Platform', value: 'Gratis' },
              { icon: Award, label: 'Kualitas', value: 'Terkurasi' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-indigo-200" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-indigo-200 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Jelajahi Kategori</h2>
          <p className="text-gray-500">Temukan karya sastra sesuai minat anda</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
          {categories.map((cat: { id: number; name: string; slug: string; description?: string }) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="card-hover group flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-2xl text-center"
            >
              <span className="text-3xl">{categoryIcons[cat.slug] || '📄'}</span>
              <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Terbaru</h2>
              <p className="text-gray-500">Karya-karya terbaru dari penulis SASMITA</p>
            </div>
            <Link href="/search" className="hidden md:inline-flex items-center gap-1 text-indigo-600 font-medium hover:gap-2 transition-all">
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
              <Link href="/register" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">
                Jadilah penulis pertama →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {articles.map((article: { id: number; title: string; slug: string; excerpt?: string; publishedAt?: string; coverImage?: string }) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="card-hover group bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  {/* Cover image or gradient placeholder */}
                  {article.coverImage ? (
                    <div className="h-44 overflow-hidden">
                      <img src={`${process.env.NEXT_PUBLIC_API_URL || ''}${article.coverImage}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-pink-900/30 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-indigo-300 rounded-full" />
                        <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-purple-300 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-pink-300 rounded-lg rotate-45" />
                      </div>
                      <BookOpen className="w-10 h-10 text-indigo-300 group-hover:scale-110 transition-transform relative z-10" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {article.excerpt || 'Baca selengkapnya...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : ''}
                      </p>
                      <span className="text-xs text-indigo-600 font-medium group-hover:underline">Baca →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/search" className="inline-flex items-center gap-1 text-indigo-600 font-medium">
              Lihat semua artikel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siap Membagikan Karya Anda?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan komunitas penulis SASMITA dan mulai
            terbitkan puisi, cerpen, esai, dan karya akademik anda.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transition-all"
          >
            Daftar Sekarang — Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
