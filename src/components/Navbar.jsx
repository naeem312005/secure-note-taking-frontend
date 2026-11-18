import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CareGuide SecureNotes
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/posts"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/posts') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Public Posts
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/notes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/notes') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    My Notes
                  </Link>
                  <Link
                    to="/notes/create"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/notes/create') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    + New Note
                  </Link>
                </>
              )}

              {/* Admin-Only Links */}
              {isAuthenticated && isAdmin && (
                <>
                  <div className="h-6 w-px bg-gray-300 self-center mx-1"></div>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/users') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/notes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/notes') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    All Notes
                  </Link>
                  <Link
                    to="/admin/aggregations/interests"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/aggregations/interests') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Interests Aggregation
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-end space-x-1">
                    <span>{user?.email}</span>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
