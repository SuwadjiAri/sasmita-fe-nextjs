'use client';

import { create } from 'zustand';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  type: 'danger' | 'warning' | 'info';
  onConfirm: (() => void) | null;
  show: (opts: { title: string; message: string; confirmLabel?: string; type?: 'danger' | 'warning' | 'info'; onConfirm: () => void }) => void;
  hide: () => void;
}

export const useConfirm = create<ConfirmState>((set) => ({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Ya',
  type: 'danger',
  onConfirm: null,
  show: (opts) => set({
    visible: true,
    title: opts.title,
    message: opts.message,
    confirmLabel: opts.confirmLabel || 'Ya, Lanjutkan',
    type: opts.type || 'danger',
    onConfirm: opts.onConfirm,
  }),
  hide: () => set({ visible: false, onConfirm: null }),
}));

const buttonStyles = {
  danger: 'btn-bahaya',
  warning: 'btn-emas',
  info: 'btn-utama',
};

const iconBg = {
  danger: 'bg-red-50',
  warning: 'bg-emas-50',
  info: 'bg-tinta-100',
};

const iconColor = {
  danger: 'text-red-700',
  warning: 'text-emas-700',
  info: 'text-tinta-700',
};

export default function ConfirmModal() {
  const { visible, title, message, confirmLabel, type, onConfirm, hide } = useConfirm();

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm?.();
    hide();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={hide} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm animate-fade-in-up rounded-xl bg-white p-6 shadow-[0_24px_60px_-20px_rgba(28,38,55,0.5)]"
      >
        <button
          onClick={hide}
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-lg p-1 text-tinta-400 transition-colors hover:bg-tinta-100 hover:text-tinta-700"
        >
          <X className="h-4 w-4" />
        </button>

        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg[type]}`}>
          <AlertTriangle className={`h-6 w-6 ${iconColor[type]}`} />
        </span>

        <h3 className="mt-4 text-lg font-semibold text-tinta-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-tinta-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button onClick={hide} className="btn-garis flex-1">
            Batal
          </button>
          <button onClick={handleConfirm} className={`${buttonStyles[type]} flex-1`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
