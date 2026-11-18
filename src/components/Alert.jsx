import React from 'react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-md border mb-4 flex justify-between items-start ${styles[type] || styles.error}`}>
      <div className="text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
