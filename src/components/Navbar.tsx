import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { Logo } from './Logo.js';
import {
  Compass,
  PlusCircle,
  LayoutDashboard,
  BookmarkCheck,
  Menu,
  X,
  UserCheck,
  Briefcase,
  RefreshCw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, role, setRole, handleResetDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const navLinks = [
    {
      label: 'Marketplace',
      path: '/marketplace',
      icon: Compass,
    },
    {
      label: 'Post a Gig',
      path: '/post-gig',
      icon: PlusCircle,
    },
    {
      label: 'Creator Dashboard',
      path: '/creator-dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'My Bookings',
      path: '/my-bookings',
      icon: BookmarkCheck,
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleReset = async () => {
    setIsResetting(true);
    await handleResetDemoData();
    setIsResetting(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5 transition-transform active:scale-95"
            aria-label="CreatorHub Home"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentPath === link.path ||
                (link.path === '/marketplace' && currentPath.startsWith('/gigs/')) ||
                (link.path === '/marketplace' && currentPath.startsWith('/book/'));

              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/80 ring-1 ring-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {role === 'CREATOR' ? (
              <button
                onClick={() => handleNavClick('/post-gig')}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Gig</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('/marketplace')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Explore Talent</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {/* Quick Role Toggle on Mobile */}
          <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Persona
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole('CLIENT')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border ${
                  role === 'CLIENT'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Client Mode</span>
              </button>
              <button
                onClick={() => setRole('CREATOR')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border ${
                  role === 'CREATOR'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Creator Mode</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                    isActive
                      ? 'bg-slate-800/90 text-white border-slate-700'
                      : 'text-slate-300 hover:bg-slate-900 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Actions inside Mobile Drawer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Reset Database</span>
            </button>

            <button
              onClick={() => handleNavClick('/post-gig')}
              className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Post a Gig
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
