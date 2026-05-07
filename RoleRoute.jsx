import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RoleRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== requiredRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
