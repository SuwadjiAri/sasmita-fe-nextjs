'use client';

import Link from 'next/link';
import AdSlot from '@/components/ui/AdSlot';

const navigasi = [
  { href: '/', label: 'Beranda' },
  { href: '/categories', label: 'Kategori' },
  { href: '/search', label: 'Cari Artikel' },
  { href: '/subscription', label: 'Langganan' },
  { href: '/redaksi', label: 'Redaksi' },
];

const kategori = [
  { slug: 'puisi', label: 'Puisi' },
  { slug: 'cerpen', label: 'Cerpen' },
  { slug: 'esai', label: 'Esai' },
  { slug: 'novel', label: 'Novel' },
  { slug: 'resensi', label: 'Resensi' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-tinta-950 text-tinta-300">
      <AdSlot position="footer" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src="/logo-sasmita.png"
              alt="SASMITA.com"
              width={1048}
              height={225}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-tinta-400">
              Platform literasi digital karya sastra dan akademik mahasiswa,
              Program Studi Sastra Indonesia, Universitas Pamulang. Tempat
              menulis, membaca, dan berbagi karya.
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
            <h2 className="label-mikro text-tinta-400">Kategori</h2>
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
            &copy; {new Date().getFullYear()} SASMITA.COM. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
