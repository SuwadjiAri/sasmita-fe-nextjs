import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ambilJson } from '@/lib/server-fetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Kategori = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smita.id/api';

async function getCategories() {
  return ambilJson<{ data: Kategori[] }>(
    `${API}/categories`,
    { cache: 'no-store' }
  );
}

export const metadata = { title: 'Rubrik & Kategori Sastra' };

export default async function CategoriesPage() {
  const categories = (await getCategories())?.data || [];

  return (
    <div>
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="label-mikro">Rubrik Sastra</p>
          <h1 className="mt-3 text-4xl font-serif font-bold text-tinta-900">Rubrik & Kategori Sastra</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-tinta-600">
            Karya sastra dikelompokkan menurut bentuknya: Opini, Esai, Cerpen, Puisi, Resensi, dan Novel.
            Pilih salah satu rubrik untuk membaca naskah kurasi redaksi SMITA.ID.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 stagger-children md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="kartu-tautan group p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emas-50 font-serif text-2xl font-semibold text-emas-700">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-tinta-900 transition-colors group-hover:text-emas-700">
                    {cat.name}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-tinta-500">
                    {cat.description || 'Lihat karya dalam kategori ini.'}
                  </p>
                </div>
              </div>

              <p className="mt-5 flex items-center gap-1.5 border-t border-tinta-200/70 pt-4 text-sm font-medium text-tinta-500 transition-colors group-hover:text-emas-700">
                Lihat karya
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
