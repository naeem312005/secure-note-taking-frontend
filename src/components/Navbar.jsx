import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Users,
  Layers,
  Plus,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-7 shrink-0">
            <Link
              to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              className="flex items-center space-x-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm ring-1 ring-zinc-950/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
              </div>
              <div className="flex items-center space-x-1.5 text-[15px] font-semibold tracking-tight text-zinc-900">
                <span>CareGuide</span>
                <span className="text-zinc-400 font-normal">/</span>
                <span className="text-zinc-600 font-medium">Notes</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              <Link
                to="/posts"
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive('/posts')
                    ? 'text-zinc-900 bg-zinc-100 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                Community
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      isActive('/dashboard')
                        ? 'text-zinc-900 bg-zinc-100 font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                    Dashboard
                  </Link>

                  <Link
                    to="/notes"
                    className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      isActive('/notes') && !isActive('/notes/create')
                        ? 'text-zinc-900 bg-zinc-100 font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    My Notes
                  </Link>
                </>
              )}

              {/* Admin Menu Dropdown */}
              {isAuthenticated && isAdmin && (
                <div className="relative pl-1" ref={adminMenuRef}>
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap gap-1.5 ${
                      isAdminRoute
                        ? 'bg-zinc-900 text-white font-medium shadow-xs'
                        : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Admin Console
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        adminMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Card */}
                  {adminMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl ring-1 ring-black/5 border border-zinc-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                        Administrative Controls
                      </div>

                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg mx-1.5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        System Metrics
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg mx-1.5 transition-colors"
                      >
                        <Users className="w-4 h-4 text-zinc-400" />
                        User Directory
                      </Link>
                      <Link
                        to="/admin/notes"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg mx-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-zinc-400" />
                        All System Notes
                      </Link>
                      <div className="border-t border-zinc-100 my-1"></div>
                      <Link
                        to="/admin/aggregations/interests"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg mx-1.5 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-emerald-600" />
                        Interest Analytics
                        <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          Agg
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notes/create"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Note</span>
                </Link>

                <div className="h-4 w-px bg-zinc-200"></div>

                <div className="flex items-center space-x-2.5 pl-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isAdmin ? 'bg-zinc-900 text-emerald-400 ring-1 ring-zinc-700' : 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200'
                    }`}
                  >
                    {getUserInitials(user?.name)}
                  </div>
                  <div className="text-left text-xs whitespace-nowrap hidden md:block">
                    <div className="font-semibold text-zinc-900 leading-tight flex items-center gap-1.5">
                      <span>{user?.name}</span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                          isAdmin
                            ? 'bg-zinc-900 text-zinc-100'
                            : 'bg-zinc-100 text-zinc-600'
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
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 whitespace-nowrap text-xs font-medium">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md shadow-xs transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200/80 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {isAuthenticated && (
            <div className="p-3 bg-zinc-50 rounded-xl flex items-center justify-between mb-3 border border-zinc-100">
              <div>
                <div className="text-sm font-semibold text-zinc-900">{user?.name}</div>
                <div className="text-xs text-zinc-500 font-mono">{user?.email}</div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-zinc-200 px-2 py-0.5 rounded text-zinc-800">
                {user?.role}
              </span>
            </div>
          )}

          <Link
            to="/posts"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
          >
            <Compass className="w-4 h-4 text-zinc-400" />
            Community Posts
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                Dashboard
              </Link>
              <Link
                to="/notes"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                My Notes
              </Link>
              <Link
                to="/notes/create"
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50/60 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Create New Note
              </Link>

              {isAdmin && (
                <div className="pt-2 border-t border-zinc-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Admin Tools
                  </div>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                    Overview
                  </Link>
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <Users className="w-4 h-4 text-zinc-400" />
                    User Directory
                  </Link>
                  <Link
                    to="/admin/notes"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-zinc-400" />
                    All System Notes
                  </Link>
                  <Link
                    to="/admin/aggregations/interests"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <Layers className="w-4 h-4 text-zinc-400" />
                    Interest Analytics
                  </Link>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-2 border-t border-zinc-100 flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-sm font-medium border border-zinc-200 rounded-lg text-zinc-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
