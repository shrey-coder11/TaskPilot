import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-6">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
