import React from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  const btnColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    primary: 'bg-zinc-900 hover:bg-zinc-800 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-zinc-950/40 backdrop-blur-xs"
          onClick={onClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block px-5 pt-5 pb-5 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-zinc-200/80 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
            <h3 className="text-base font-bold tracking-tight text-zinc-900">{title}</h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 text-sm text-zinc-600">{children}</div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              Cancel
            </button>
            {onConfirm && (
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-2xs transition-colors disabled:opacity-50 ${btnColors[confirmVariant]}`}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
