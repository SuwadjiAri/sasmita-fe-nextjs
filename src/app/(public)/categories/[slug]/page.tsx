import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryArticles(slug: string) {
  const catRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/categories`,
    { next: { revalidate: 3600 } }
  );
  if (!catRes.ok) return { category: null, articles: [] };
  const { data: categories } = await catRes.json();
  const category = categories.find((c: { slug: string }) => c.slug === slug);
  if (!category) return { category: null, articles: [] };

  const artRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/articles?category_id=${category.id}`,
    { next: { revalidate: 60 } }
  );
  if (!artRes.ok) return { category, articles: [] };
  const { data: articles } = await artRes.json();
  return { category, articles };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const { category, articles } = await getCategoryArticles(slug);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori Tidak Ditemukan</h1>
        <Link href="/categories" className="text-indigo-600 hover:underline">Lihat semua kategori</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
      <p className="text-gray-500 mb-8">{category.description}</p>

      {articles.length === 0 ? (
        <p className="text-gray-500">Belum ada artikel dalam kategori ini.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: { id: number; title: string; slug: string; excerpt?: string }) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3">{article.excerpt || ''}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
