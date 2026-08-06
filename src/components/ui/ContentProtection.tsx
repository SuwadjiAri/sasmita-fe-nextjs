'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Alasan isi artikel dikaburkan. Berupa himpunan, bukan satu boolean, karena
 * ketiganya bisa aktif bersamaan dan yang satu tidak boleh menjernihkan layar
 * selama yang lain masih menghendaki kabur.
 */
type Alasan = 'fokus' | 'tab' | 'tetikus';

const JEDA_KELUAR_MS = 400;

/** Tombol yang menandakan pembaca sedang menggulir dengan papan ketik. */
const TOMBOL_BACA = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'PageUp', 'PageDown', 'Home', 'End', ' ',
]);

function targetDapatDiketik(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [alasan, setAlasan] = useState<ReadonlySet<Alasan>>(new Set());
  const wadahRef = useRef<HTMLDivElement>(null);
  const jedaKeluar = useRef<number | null>(null);

  const tambahAlasan = useCallback((a: Alasan) => {
    setAlasan((lama) => (lama.has(a) ? lama : new Set(lama).add(a)));
  }, []);

  const hapusAlasan = useCallback((a: Alasan) => {
    setAlasan((lama) => {
      if (!lama.has(a)) return lama;
      const baru = new Set(lama);
      baru.delete(a);
      return baru;
    });
  }, []);

  // Fokus jendela dan perpindahan tab dipantau terpisah: berpindah tab tidak
  // selalu memicu `blur`.
  useEffect(() => {
    const onBlur = () => tambahAlasan('fokus');
    const onFocus = () => hapusAlasan('fokus');
    const onVisibility = () =>
      document.hidden ? tambahAlasan('tab') : hapusAlasan('tab');

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tambahAlasan, hapusAlasan]);

  // Kursor keluar area artikel. Hanya pada perangkat bertetikus; di layar
  // sentuh, ketukan menghasilkan mouseenter/mouseleave tiruan.
  useEffect(() => {
    const wadah = wadahRef.current;
    if (!wadah) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const batalkanJeda = () => {
      if (jedaKeluar.current !== null) {
        window.clearTimeout(jedaKeluar.current);
        jedaKeluar.current = null;
      }
    };

    // Jeda menahan kabur saat kursor cuma melintas ke bilah gulir atau iklan
    // samping. Tanpa itu layar berkedip-kedip.
    const keluar = () => {
      batalkanJeda();
      jedaKeluar.current = window.setTimeout(() => {
        jedaKeluar.current = null;
        tambahAlasan('tetikus');
      }, JEDA_KELUAR_MS);
    };

    const masuk = () => {
      batalkanJeda();
      hapusAlasan('tetikus');
    };

    // Jalan keluar untuk pembaca papan ketik: mereka tidak menyentuh tetikus
    // sama sekali, jadi `mouseenter` tidak akan pernah terpicu.
    const onKeyNav = (e: KeyboardEvent) => {
      if (TOMBOL_BACA.has(e.key)) masuk();
    };

    wadah.addEventListener('mouseleave', keluar);
    wadah.addEventListener('mouseenter', masuk);
    document.addEventListener('keydown', onKeyNav);

    return () => {
      batalkanJeda();
      wadah.removeEventListener('mouseleave', keluar);
      wadah.removeEventListener('mouseenter', masuk);
      document.removeEventListener('keydown', onKeyNav);
    };
  }, [tambahAlasan, hapusAlasan]);

  // Ctrl+C tidak diblokir di sini: `user-select: none` sudah menghalangi
  // seleksi teks artikel, dan memblokirnya global hanya mematikan salin-tempel
  // di kotak komentar. Penyalinan dari dalam artikel ditangani `onCopy`.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (targetDapatDiketik(e.target)) return;

      const k = e.key.toLowerCase();
      if (e.ctrlKey && !e.shiftKey && ['u', 's', 'p', 'a'].includes(k)) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) e.preventDefault();
      if (e.key === 'F12') e.preventDefault();
      // PrintScreen tidak ditangani: Windows hanya mengirim `keyup` untuk
      // tombol itu, jadi penanganan lewat `keydown` tidak pernah berjalan.
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const kabur = alasan.size > 0;
  const watermarkText = user?.email || 'SASMITA.COM';
  const petunjuk =
    alasan.has('tetikus') && !alasan.has('fokus') && !alasan.has('tab')
      ? 'Arahkan kursor ke artikel untuk melanjutkan membaca'
      : 'Klik halaman ini untuk melanjutkan membaca';

  return (
    <div
      ref={wadahRef}
      className="content-protection relative"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Hanya lapisan ini yang dikaburkan, supaya petunjuk tetap terbaca. */}
      <div
        className="relative transition-all duration-300"
        style={{ filter: kabur ? 'blur(20px)' : 'none' }}
      >
        {/* Watermark */}
        <div
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 150px,
              rgba(0,0,0,0.02) 150px,
              rgba(0,0,0,0.02) 151px
            )`,
          }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute whitespace-nowrap text-tinta-300/20 font-bold text-sm select-none"
              style={{
                transform: 'rotate(-35deg)',
                top: `${i * 120 + 20}px`,
                left: '-100px',
                right: '-100px',
                textAlign: 'center',
                letterSpacing: '8px',
              }}
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className="mx-16">{watermarkText}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="content-protected">{children}</div>
      </div>

      {/* Di luar lapisan yang dikaburkan. `aria-hidden` karena kabur hanya efek
          visual, tidak menghalangi pembantu baca layar. */}
      {kabur && (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-24"
          aria-hidden="true"
        >
          <p className="rounded-lg bg-tinta-900/90 px-5 py-3 text-sm text-white shadow-lg">
            {petunjuk}
          </p>
        </div>
      )}
    </div>
  );
}
