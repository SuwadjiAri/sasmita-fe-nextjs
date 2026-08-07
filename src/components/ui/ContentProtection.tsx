'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

// Alasan kabur berupa himpunan, bukan boolean: ketiganya bisa aktif bersamaan.
type Alasan = 'fokus' | 'tab' | 'tetikus';

const JEDA_KELUAR_MS = 400;

// Jarak antarbaris watermark, dipakai juga untuk menghitung jumlah barisnya.
const JARAK_BARIS_WATERMARK = 120;

// Ditulis ke clipboard setelah PrintScreen. Bukan pencegahan, lihat docs bagian 8.
const TEKS_PENGGANTI_CLIPBOARD =
  'Isi artikel SASMITA.COM dilindungi hak cipta. Tangkapan layar tidak disertakan.';

// Tombol yang menandakan pembaca sedang menggulir dengan papan ketik.
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
  const [tinggiWadah, setTinggiWadah] = useState(0);
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

  // Dipantau terpisah: berpindah tab tidak selalu memicu `blur`.
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

  // Hanya perangkat bertetikus: layar sentuh memicu mouseenter/mouseleave tiruan.
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

    // Jeda menahan kabur saat kursor cuma melintas ke bilah gulir atau iklan.
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

    // Jalan keluar pembaca papan ketik: `mouseenter` tidak akan pernah terpicu.
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

  // Ctrl+C sengaja tidak diblokir, itu hanya mematikan salin di kotak komentar.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (targetDapatDiketik(e.target)) return;

      const k = e.key.toLowerCase();
      if (e.ctrlKey && !e.shiftKey && ['u', 's', 'p', 'a'].includes(k)) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) e.preventDefault();
      if (e.key === 'F12') e.preventDefault();
      // PrintScreen tidak di sini: Windows cuma mengirim `keyup` untuk tombol itu.
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // PrintScreen tak bisa dicegah, hanya alur tempel-ke-Paint yang dipatahkan.
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'PrintScreen') return;
      // Gagal diam-diam di Firefox dan Safari: `keyup` bukan gerak-gerik pengguna.
      void navigator.clipboard?.writeText(TEKS_PENGGANTI_CLIPBOARD).catch(() => {});
    };

    document.addEventListener('keyup', onKeyUp);
    return () => document.removeEventListener('keyup', onKeyUp);
  }, []);

  // Diukur supaya watermark menutup sampai bawah artikel yang panjang.
  useEffect(() => {
    const wadah = wadahRef.current;
    if (!wadah) return;
    const pengamat = new ResizeObserver(([entri]) => {
      setTinggiWadah(entri.contentRect.height);
    });
    pengamat.observe(wadah);
    return () => pengamat.disconnect();
  }, []);

  const kabur = alasan.size > 0;
  const watermarkText = user?.email || 'SASMITA.COM';
  const barisWatermark = Math.max(
    8,
    Math.ceil(tinggiWadah / JARAK_BARIS_WATERMARK) + 1,
  );
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
        <div className="content-protected">{children}</div>
      </div>

      {/* Di luar lapisan kabur, supaya tetap terbaca pada tangkapan layar. */}
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
        {Array.from({ length: barisWatermark }).map((_, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap text-tinta-500/25 font-bold text-sm select-none"
            style={{
              transform: 'rotate(-35deg)',
              top: `${i * JARAK_BARIS_WATERMARK + 20}px`,
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

      {/* `aria-hidden` karena kabur hanya efek visual, bukan penghalang baca. */}
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
