import Link from 'next/link';
import { BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryStyles: Record<string, { emoji: string; gradient: string; bgLight: string }> = {
  puisi: { emoji: '🎭', gradient: 'from-pink-500 to-rose-500', bgLight: 'from-pink-50 to-rose-50' },
  cerpen: { emoji: '📖', gradient: 'from-blue-500 to-cyan-500', bgLight: 'from-blue-50 to-cyan-50' },
  esai: { emoji: '📝', gradient: 'from-emerald-500 to-teal-500', bgLight: 'from-emerald-50 to-teal-50' },
  novel: { emoji: '📚', gradient: 'from-purple-500 to-violet-500', bgLight: 'from-purple-50 to-violet-50' },
  resensi: { emoji: '⭐', gradient: 'from-amber-500 to-orange-500', bgLight: 'from-amber-50 to-orange-50' },
  'artikel-akademik': { emoji: '🎓', gradient: 'from-indigo-500 to-blue-600', bgLight: 'from-indigo-50 to-blue-50' },
};

const defaultStyle = { emoji: '📄', gradient: 'from-gray-500 to-gray-600', bgLight: 'from-gray-50 to-slate-50' };

async function getCategoryArticles(slug: string) {
  const catRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`,
    { next: { revalidate: 3600 } }
  );
  if (!catRes.ok) return { category: null, articles: [] };
  const { data: categories } = await catRes.json();
  const category = categories.find((c: { slug: string }) => c.slug === slug);
  if (!category) return { category: null, articles: [] };

  const artRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/articles?category_id=${category.id}`,
    { next: { revalidate: 60 } }
  );
  if (!artRes.ok) return { category, articles: [] };
  const { data: articles } = await artRes.json();
  return { category, articles };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const { category, articles } = await getCategoryArticles(slug);
  const style = categoryStyles[slug] || defaultStyle;

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kategori Tidak Ditemukan</h1>
        <Link href="/categories" className="text-indigo-600 hover:underline">Lihat semua kategori</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className={`relative bg-gradient-to-r ${style.gradient} overflow-hidden`}>
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <Link href="/categories" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Semua Kategori
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{style.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
              <p className="text-white/80 mt-1">{category.description || `Kumpulan karya ${category.name.toLowerCase()}`}</p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-4">{articles.length} artikel</p>
        </div>
      </section>

      {/* Articles */}
      <section className={`bg-gradient-to-b ${style.bgLight} to-white min-h-[40vh]`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">Belum ada artikel</p>
              <p className="text-gray-500">Belum ada karya {category.name.toLowerCase()} yang dipublikasikan.</p>
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
                  className="card-hover group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  {/* Cover */}
                  {article.coverImage ? (
                    <div className="h-44 overflow-hidden">
                      <img src={`${process.env.NEXT_PUBLIC_API_URL || ''}${article.coverImage}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className={`h-40 bg-gradient-to-br ${style.bgLight} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-12 h-12 border-2 border-current rounded-full opacity-30" />
                        <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-current rounded-full opacity-20" />
                      </div>
                      <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform">{style.emoji}</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {article.excerpt || 'Baca selengkapnya...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Baca <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
