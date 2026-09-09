import React from 'react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div
      id="toastContainer"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none notranslate select-none"
    >
      {toasts.map((t) => {
        const bg =
          t.type === 'success'
            ? 'bg-emerald-600 border-emerald-400'
            : t.type === 'warning'
            ? 'bg-amber-600 border-amber-400'
            : 'bg-blue-600 border-blue-400';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto px-3 py-2 rounded border text-white text-xs shadow-xl transition-all duration-300 ${bg}`}
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
};
