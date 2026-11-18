import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: {
      wrapper: 'bg-rose-50/70 border-rose-200/80 text-rose-900',
      icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
    },
    success: {
      wrapper: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    },
    info: {
      wrapper: 'bg-zinc-50 border-zinc-200 text-zinc-900',
      icon: <Info className="w-4 h-4 text-zinc-500 shrink-0" />
    },
    warning: {
      wrapper: 'bg-amber-50/70 border-amber-200/80 text-amber-900',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
    }
  };

  const current = styles[type] || styles.error;

  return (
    <div
      role="alert"
      className={`p-3.5 rounded-xl border mb-5 flex items-start justify-between gap-3 shadow-2xs text-xs font-medium animate-in fade-in duration-100 ${current.wrapper}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{current.icon}</div>
        <div className="leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
