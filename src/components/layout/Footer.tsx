'use client';

import Link from 'next/link';
import AdSlot from '@/components/ui/AdSlot';

const navigasi = [
  { href: '/', label: 'Beranda' },
  { href: '/categories', label: 'Rubrik' },
  { href: '/search', label: 'Cari Karya' },
  { href: '/subscription', label: 'Langganan' },
  { href: '/redaksi', label: 'Redaksi' },
];

const kategori = [
  { slug: 'opini', label: 'Opini' },
  { slug: 'esai', label: 'Esai' },
  { slug: 'cerpen', label: 'Cerpen' },
  { slug: 'puisi', label: 'Puisi' },
  { slug: 'resensi', label: 'Resensi' },
  { slug: 'novel', label: 'Novel' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-tinta-950 text-tinta-300">
      <AdSlot position="footer" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo-smita.png"
                alt="Smita.id"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-contain shadow-md transition-transform group-hover:scale-105"
              />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Smita<span className="text-emas-400">.id</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-tinta-400">
              Platform literasi digital karya sastra mahasiswa dan umum,
              Program Studi Sastra Indonesia, Universitas Pamulang. Menghimpun
              opini, esai, cerpen, puisi, resensi, dan serial novel.
            </p>
          </div>

          <div>
            <h2 className="label-mikro text-tinta-400">Navigasi</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {navigasi.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label-mikro text-tinta-400">Rubrik Sastra</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {kategori.map((item) => (
                <li key={item.slug}>
                  <Link href={`/categories/${item.slug}`} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-sm text-tinta-400">
            &copy; {new Date().getFullYear()} SMITA.ID. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
