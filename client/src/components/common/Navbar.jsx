import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  GraduationCap, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard,
  Sparkles,
  Award,
  FileText,
  Brain,
  Users
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  const getClassRoute = () => {
    if (user?.role === 'instructor' || user?.role === 'admin') return '/instructor/classes';
    return '/student/classes';
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                EduSphere
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-950/80 border border-brand-800/50 px-2 py-0.5 rounded-full ml-2">
                Pro LMS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-brand-400 transition-colors py-1">
              Home
            </Link>
            <Link to="/courses" className="hover:text-brand-400 transition-colors py-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-400" />
              Courses
            </Link>
            <Link to="/articles" className="hover:text-brand-400 transition-colors py-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              Articles
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/student/aptitude" className="hover:text-brand-400 transition-colors py-1 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Aptitude Test
                </Link>
                <Link to={getClassRoute()} className="hover:text-brand-400 transition-colors py-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  Virtual Classes
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-sm font-semibold text-slate-200">{user?.name}</div>
                    <div className="text-[11px] capitalize text-brand-400 font-medium">
                      {user?.role}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl shadow-2xl py-2 border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-400" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors border-t border-slate-800/60 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-xl hover:shadow-glow transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 glass-card px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-brand-400"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-brand-400"
          >
            Courses
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-brand-600 text-white rounded-xl font-medium"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-center py-2.5 text-rose-400 hover:bg-rose-950/30 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-slate-300 border border-slate-800 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-brand-600 text-white rounded-xl font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
