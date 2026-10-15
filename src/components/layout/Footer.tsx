'use client';

import Link from 'next/link';
import AdSlot from '@/components/ui/AdSlot';

import { useEffect, useState } from 'react';

const navigasi = [
  { href: '/', label: 'Beranda' },
  { href: '/categories', label: 'Rubrik' },
  { href: '/search', label: 'Cari Karya' },
  { href: '/subscription', label: 'Langganan' },
  { href: '/redaksi', label: 'Redaksi' },
  { href: '/privacy', label: 'Kebijakan Privasi' },
  { href: '/terms', label: 'Syarat & Ketentuan' },
];

const kategoriDefault = [
  { slug: 'opini', label: 'Opini' },
  { slug: 'esai', label: 'Esai' },
  { slug: 'cerpen', label: 'Cerpen' },
  { slug: 'puisi', label: 'Puisi' },
  { slug: 'resensi', label: 'Resensi' },
  { slug: 'novel', label: 'Novel' },
];

export default function Footer() {
  const [kategoriList, setKategoriList] = useState(kategoriDefault);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((json) => {
        if (isMounted && json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setKategoriList(
            json.data.map((cat: { slug: string; name: string }) => ({
              slug: cat.slug,
              label: cat.name,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);
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
            <div className="mt-5 max-w-md space-y-3 text-sm leading-relaxed text-tinta-400">
              <p>
                <span className="block font-semibold text-white">Ruang Bersuara untuk Literasi</span>
                Platform literasi digital yang mewadahi opini publik, esai, dan karya sastra sebagai ruang bersuara generasi cakap-tulis.
              </p>
              <p className="text-xs leading-relaxed text-tinta-400">
                <span className="block font-semibold text-tinta-300">Sarana Media Informasi dan Sastra</span>
                Jl Raya Puspitek Buaran No 46 Kecamatan Serpong<br />
                Kota Tangerang Selatan - Banten Kode Pos 15316
              </p>
            </div>
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
              {kategoriList.map((item) => (
                <li key={item.slug}>
                  <Link href={`/categories/${item.slug}`} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-tinta-400">
            &copy; {new Date().getFullYear()} SMITA.ID. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-tinta-400">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
