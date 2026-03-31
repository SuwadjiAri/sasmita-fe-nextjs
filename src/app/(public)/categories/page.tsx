import Link from 'next/link';

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata = { title: 'Kategori' };

export default async function CategoriesPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategori</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: { id: number; name: string; slug: string; description?: string }) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{cat.name}</h2>
            <p className="text-gray-500 text-sm">{cat.description || 'Lihat karya dalam kategori ini'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
