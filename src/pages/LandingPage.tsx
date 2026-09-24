import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchGigs, fetchBookings } from '../services/api.js';
import { Gig } from '../types/index.js';
import { GigCard } from '../components/GigCard.js';
import { BookingModal } from '../components/BookingModal.js';
import { GigCardSkeleton } from '../components/SkeletonLoader.js';
import { FeaturesShowcase } from '../components/FeaturesShowcase.js';
import {
  Sparkles,
  ArrowRight,
  Video,
  Palette,
  Code2,
  PenTool,
  Megaphone,
  Camera,
  Music,
  GraduationCap,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, setPreselectedCategory, creators } = useApp();
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([]);
  const [totalGigsCount, setTotalGigsCount] = useState<number>(0);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [bookingGig, setBookingGig] = useState<Gig | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [allGigs, allBookings] = await Promise.all([
          fetchGigs({ availability: 'all' }),
          fetchBookings().catch(() => []),
        ]);
        setTotalGigsCount(allGigs.length);
        setFeaturedGigs(allGigs.filter((g) => g.availability).slice(0, 6));
        setBookingsCount(allBookings.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Video Editing', filter: 'Video', icon: Video, desc: 'Short-form Reels, documentary, YouTube edits' },
    { name: 'Graphic Design', filter: 'Design', icon: Palette, desc: 'Brand systems, SaaS UI/UX, 3D visualizations' },
    { name: 'Programming', filter: 'Programming', icon: Code2, desc: 'Full-stack React, Express APIs, CI/CD pipelines' },
    { name: 'Content Writing', filter: 'Writing', icon: PenTool, desc: 'B2B copy, newsletters, developer documentation' },
    { name: 'Social Media', filter: 'Marketing', icon: Megaphone, desc: 'Organic growth strategies, viral hooks, SEO' },
    { name: 'Photography', filter: 'Photography', icon: Camera, desc: 'Founder portraits, commercial products' },
    { name: 'Music & Audio', filter: 'Music', icon: Music, desc: 'Podcast mastering, custom sonic branding' },
    { name: 'Tutoring & Mentorship', filter: 'Education', icon: GraduationCap, desc: '1-on-1 Figma masterclasses, code reviews' },
  ];

  const handleCategoryClick = (catFilter: string) => {
    setPreselectedCategory(catFilter);
    navigate('/marketplace');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Creator Economy Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Turn Your Skills Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
              Opportunities
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Discover creators. Book talent. Build something great together with transparent pricing and zero auth friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/post-gig')}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Post a Gig</span>
            </button>
          </div>

          {/* Real Live Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">{creators.length || 1}</div>
              <div className="text-xs text-slate-400">Active Creators</div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">{totalGigsCount || 0}</div>
              <div className="text-xs text-slate-400">Published Gigs</div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{bookingsCount}</div>
              <div className="text-xs text-slate-400">Total Bookings</div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-slate-400">Direct Bookings</div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED 5 CORE FEATURES SHOWCASE */}
      <FeaturesShowcase />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Featured Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore specialized services offered by top creators
            </p>
          </div>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.filter)}
                className="group p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-indigo-950 group-hover:text-indigo-300 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Gigs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trending Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated high-demand services ready for immediate booking
            </p>
          </div>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>All gigs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GigCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onBookClick={(g) => setBookingGig(g)}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              How CreatorHub Works
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simple, transparent, and built for both creators and clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
              <span className="font-mono text-2xl font-bold text-indigo-400">01</span>
              <h3 className="text-base font-bold text-slate-100">Publish a Gig</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Creators publish their skills, define deliverables, set rates, and toggle live availability.
              </p>
            </div>

            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
              <span className="font-mono text-2xl font-bold text-cyan-400">02</span>
              <h3 className="text-base font-bold text-slate-100">Browse & Book</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Clients discover vetted talent and submit structured project bookings with immediate confirmation.
              </p>
            </div>

            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
              <span className="font-mono text-2xl font-bold text-emerald-400">03</span>
              <h3 className="text-base font-bold text-slate-100">Manage & Deliver</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Creators accept or decline from their Dashboard. Clients track live order states in My Bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingGig && (
        <BookingModal
          gig={bookingGig}
          onClose={() => setBookingGig(null)}
          onBookingSuccess={() => setBookingGig(null)}
        />
      )}
    </div>
  );
};
