import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import ArticleCard, { type ArtikelKartu } from '@/components/ui/ArticleCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Artikel = ArtikelKartu & { categoryId: number };

type Kategori = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

async function getArticles() {
  const res = await fetch(`${API}/articles?per_page=6`, { next: { revalidate: 60 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function getCategories() {
  const res = await fetch(`${API}/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function HomePage() {
  const [articlesRes, categoriesRes] = await Promise.all([getArticles(), getCategories()]);
  const articles: Artikel[] = articlesRes.data || [];
  const categories: Kategori[] = categoriesRes.data || [];

  const namaKategori = new Map(categories.map((k) => [k.id, k.name]));

  return (
    <div>
      {/* Sampul */}
      <section className="relative overflow-hidden bg-tinta-950 text-white">
        {/* Cahaya tipis agar latar tinta tidak terbaca sebagai blok datar. */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 15%, #c08d3c 0, transparent 45%), radial-gradient(circle at 85% 10%, #465e80 0, transparent 40%)',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="label-mikro text-emas-300">Platform Literasi Digital</p>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.15] sm:text-5xl">
              Ruang terbit untuk karya
              <span className="text-emas-300"> sastra dan akademik</span> mahasiswa
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-tinta-300">
              SASMITA menghimpun puisi, cerpen, esai, novel, resensi, dan artikel
              akademik dalam satu tempat. Tulis naskah Anda, lewati proses kurasi
              redaksi, lalu terbitkan agar dapat dibaca siapa saja.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/search" className="btn-emas">
                Jelajahi Karya
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="btn border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Mulai Menulis
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="label-mikro text-tinta-400">Kategori</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold">{categories.length}</dd>
              </div>
              <div>
                <dt className="label-mikro text-tinta-400">Kurasi</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold">Redaksi</dd>
              </div>
              <div>
                <dt className="label-mikro text-tinta-400">Membaca</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold">Gratis</dd>
              </div>
            </dl>
          </div>

          {/* Alur penerbitan, menjelaskan apa yang terjadi setelah mendaftar. */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-7">
              <p className="label-mikro text-emas-300">Dari naskah ke terbit</p>
              <ol className="mt-6 space-y-5">
                {[
                  'Daftar akun dan masuk ke ruang penulis',
                  'Tulis naskah, pilih kategori, unggah sampul',
                  'Kirim naskah untuk ditinjau redaksi',
                  'Naskah yang lolos kurasi terbit di halaman publik',
                  'Pantau jumlah pembaca dan tanggapan yang masuk',
                ].map((langkah, i) => (
                  <li key={langkah} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emas-400/40 font-serif text-xs font-semibold text-emas-300">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-tinta-200">{langkah}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mikro">Rubrik</p>
            <h2 className="mt-3 text-3xl font-semibold text-tinta-900">Jelajahi Kategori</h2>
            <p className="mt-3 text-tinta-600">
              Karya dikelompokkan menurut bentuknya agar Anda lebih mudah menemukan
              bacaan yang dicari.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 stagger-children md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="kartu-tautan group p-5">
                {/* Monogram huruf awal, berlaku untuk kategori apa pun. */}
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emas-50 font-serif text-lg font-semibold text-emas-700">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
                <h3 className="mt-4 font-semibold text-tinta-900 transition-colors group-hover:text-emas-700">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-tinta-500">
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Karya terbaru */}
      <section className="border-y border-tinta-200/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="label-mikro">Terbaru</p>
              <h2 className="mt-3 text-3xl font-semibold text-tinta-900">Karya yang Baru Terbit</h2>
              <p className="mt-3 text-tinta-600">Naskah terbaru yang telah lolos kurasi redaksi.</p>
            </div>
            <Link href="/search" className="btn-garis">
              Lihat Semua Karya
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-tinta-300 px-6 py-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-tinta-300" />
              <p className="mt-4 text-tinta-600">Belum ada karya yang diterbitkan.</p>
              <Link href="/register" className="btn-utama mt-5">
                Jadilah penulis pertama
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 stagger-children md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  label={namaKategori.get(article.categoryId)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ajakan */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-tinta-900 px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Siap menerbitkan karya Anda?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-tinta-300">
            Buat akun, tulis naskah, dan kirimkan untuk ditinjau redaksi. Tidak ada
            biaya untuk menulis maupun menerbitkan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-emas">
              Daftar Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="btn border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
