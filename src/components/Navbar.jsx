import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setAdminMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center space-x-8 shrink-0">
            <Link
              to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="whitespace-nowrap flex items-center space-x-1">
                <span className="text-lg font-black text-gray-900 tracking-tight">CareGuide</span>
                <span className="text-lg font-semibold text-blue-600">Notes</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/posts"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive('/posts')
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Community Posts
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/notes"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive('/notes') && !isActive('/notes/create')
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    My Notes
                  </Link>
                </>
              )}

              {/* Admin Menu Dropdown */}
              {isAuthenticated && isAdmin && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isAdminRoute
                        ? 'bg-purple-100 text-purple-800 font-semibold'
                        : 'text-purple-700 hover:bg-purple-50 font-medium'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                    Admin Console
                    <svg
                      className={`w-4 h-4 ml-1.5 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Card */}
                  {adminMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Admin Tools & Pipelines
                      </div>

                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <span className="mr-2.5">📊</span>
                        Overview & Metrics
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <span className="mr-2.5">👥</span>
                        User Management
                      </Link>
                      <Link
                        to="/admin/notes"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <span className="mr-2.5">📝</span>
                        All System Notes
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link
                        to="/admin/aggregations/interests"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                      >
                        <span className="mr-2.5">⚡</span>
                        Scenario 1: Interests Aggregation
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Actions & User Info */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notes/create"
                  className="inline-flex items-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New Note
                </Link>

                <div className="h-6 w-px bg-gray-200"></div>

                {/* Profile Pill */}
                <div className="flex items-center space-x-2.5 pl-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {getUserInitials(user?.name)}
                  </div>
                  <div className="text-left text-xs whitespace-nowrap hidden md:block">
                    <div className="font-bold text-gray-900 leading-tight">{user?.name}</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 text-[11px] truncate max-w-[130px]">{user?.email}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {isAuthenticated && (
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {user?.role}
              </span>
            </div>
          )}

          <Link
            to="/posts"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Community Posts
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/notes"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                My Notes
              </Link>
              <Link
                to="/notes/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 font-bold"
              >
                + Create New Note
              </Link>

              {isAdmin && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="px-3 py-1 text-xs font-bold text-purple-600 uppercase">Admin Tools</div>
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-purple-50"
                  >
                    Overview
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-purple-50"
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/admin/notes"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-purple-50"
                  >
                    All System Notes
                  </Link>
                  <Link
                    to="/admin/aggregations/interests"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-purple-50"
                  >
                    Scenario 1: Interests Aggregation
                  </Link>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-2 border-t border-gray-200 flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
