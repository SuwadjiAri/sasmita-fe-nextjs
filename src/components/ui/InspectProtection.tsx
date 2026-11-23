'use client';

import { useEffect } from 'react';

/**
 * Komponen pelindung antarmuka web dari inspeksi kode dan klik kanan.
 * Menonaktifkan menu konteks (klik kanan) dan seluruh kombinasi tombol pintas DevTools.
 */
export default function InspectProtection() {
  useEffect(() => {
    // 1. Blokir klik kanan (context menu) di seluruh halaman
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Blokir pintasan papan ketik DevTools / Inspect Element / View Source
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code ? e.code.toLowerCase() : '';

      // Tombol F12 (DevTools baku di semua peramban)
      if (e.key === 'F12' || code === 'f12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + I / J / C / K / E (DevTools, Console, Inspector di Chrome/Edge/Firefox)
      // Mac: Cmd + Option + I / J / C
      if (
        (isCtrlOrMeta && e.shiftKey && ['i', 'j', 'c', 'k', 'e'].includes(key)) ||
        (e.metaKey && e.altKey && ['i', 'j', 'c'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + U (Lihat Sumber Halaman / View Page Source)
      if (isCtrlOrMeta && !e.shiftKey && key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Simpan Halaman / Save Page Web) di luar elemen formulir
      if (isCtrlOrMeta && !e.shiftKey && key === 's') {
        const target = e.target as HTMLElement | null;
        const isEditable =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);
        if (!isEditable) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 3. Blokir seret gambar ke tab baru (drag to open)
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
    };
  }, []);

  return null;
}
