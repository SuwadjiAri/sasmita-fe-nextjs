import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata = { title: 'Kategori' };

const categoryStyles: Record<string, { emoji: string; gradient: string; bg: string }> = {
  puisi: { emoji: '🎭', gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
  cerpen: { emoji: '📖', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
  esai: { emoji: '📝', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
  novel: { emoji: '📚', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50' },
  resensi: { emoji: '⭐', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
  'artikel-akademik': { emoji: '🎓', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50' },
};

const defaultStyle = { emoji: '📄', gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50' };

export default async function CategoriesPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Jelajahi Kategori</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Temukan karya sastra dan akademik sesuai minat anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {categories.map((cat: { id: number; name: string; slug: string; description?: string }) => {
          const style = categoryStyles[cat.slug] || defaultStyle;

          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="card-hover group relative bg-white border border-gray-100 rounded-2xl p-6 overflow-hidden"
            >
              {/* Gradient accent top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`} />

              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${style.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {style.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {cat.description || 'Lihat karya dalam kategori ini'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat karya <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
