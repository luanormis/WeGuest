import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#111111] text-[#DFCDAE] p-4 rounded-xl shadow-xl border border-[#C5A880]/30 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />}
            {toast.type === 'gold' && <Sparkles className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />}
            <p className="text-xs text-white leading-relaxed font-sans">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-white p-0.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
