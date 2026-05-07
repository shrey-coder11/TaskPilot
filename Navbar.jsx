import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              📋 TaskPilot
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              <span className="text-sm">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
              <span className="text-xs bg-blue-500 px-3 py-1 rounded">
                {user.role.toUpperCase()}
              </span>

              <div className="flex space-x-4">
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <Link to="/projects" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Projects
                </Link>
                <Link to="/tasks" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Tasks
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
