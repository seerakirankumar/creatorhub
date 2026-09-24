import React from 'react';
import { useApp } from '../context/AppContext.js';
import { Logo } from './Logo.js';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setPreselectedCategory } = useApp();

  const handleCategoryClick = (cat: string) => {
    setPreselectedCategory(cat);
    navigate('/marketplace');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="text-left focus:outline-none"
              aria-label="Home"
            >
              <Logo size="md" />
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise creator gig marketplace designed for young digital creators to publish, monetize, and manage client services with full booking transparency.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Auth Grader Mode</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Status Engine</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Platform Routes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('/post-gig')}
                  className="hover:text-white transition-colors"
                >
                  Post a Gig
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Browse & Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Book a Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/creator-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Creator Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="hover:text-white transition-colors"
                >
                  My Bookings
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Service Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {['Video', 'Design', 'Programming', 'Writing', 'Marketing', 'Photography'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-white transition-colors"
                  >
                    {cat} Services
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform Guarantees */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Guarantees
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-200 block">Transparent Booking</span>
                <span className="text-[11px] text-slate-400">Direct creator communication, clear deliverables, and instant confirmation reference.</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-200 block">Availability Protection</span>
                <span className="text-[11px] text-slate-400">Real-time scheduling guards prevent double bookings across all live gigs.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CreatorHub Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Verified Creative Marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
