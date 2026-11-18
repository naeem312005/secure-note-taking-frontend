import React from 'react';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', confirmVariant = 'danger', loading = false }) => {
  if (!isOpen) return null;

  const btnColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4">{title}</h3>
              <div className="mt-2 text-sm text-gray-600">{children}</div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
            {onConfirm && (
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium rounded-md shadow-sm sm:w-auto sm:text-sm ${btnColors[confirmVariant]} disabled:opacity-50`}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
