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
  danger: 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25',
  warning: 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-yellow-500/25',
  info: 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25',
};

const iconBg = {
  danger: 'bg-red-100',
  warning: 'bg-yellow-100',
  info: 'bg-indigo-100',
};

const iconColor = {
  danger: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-indigo-600',
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

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
        {/* Close */}
        <button onClick={hide} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 ${iconBg[type]} rounded-2xl flex items-center justify-center mb-4`}>
          <AlertTriangle className={`w-6 h-6 ${iconColor[type]}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={hide}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all ${buttonStyles[type]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
