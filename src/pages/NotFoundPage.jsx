import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-md mb-8">
        The requested page does not exist or you do not have appropriate permissions to view it.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
