import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchGigs } from '../services/api.js';
import { Gig, GigCategory } from '../types/index.js';
import { GigCard } from '../components/GigCard.js';
import { BookingModal } from '../components/BookingModal.js';
import { GigCardSkeleton } from '../components/SkeletonLoader.js';
import { EmptyState } from '../components/EmptyState.js';
import {
  Search,
  SlidersHorizontal,
  X,
  Compass,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: GigCategory[] = [
  'All',
  'Design',
  'Video',
  'Writing',
  'Programming',
  'Marketing',
  'Photography',
  'Music',
  'Education',
  'Other',
];

export const MarketplacePage: React.FC = () => {
  const { preselectedCategory, setPreselectedCategory } = useApp();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<GigCategory>(
    (preselectedCategory as GigCategory) || 'All'
  );
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'price_asc' | 'price_desc'>('relevant');

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingGig, setBookingGig] = useState<Gig | null>(null);

  // Sync if preselectedCategory changes
  useEffect(() => {
    if (preselectedCategory && preselectedCategory !== category) {
      setCategory(preselectedCategory as GigCategory);
      setPreselectedCategory(null);
    }
  }, [preselectedCategory]);

  const loadGigs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchGigs({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        availability: availabilityOnly ? 'available_only' : 'all',
        sortBy,
      });

      setGigs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch gigs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGigs();
    }, 150);
    return () => clearTimeout(timer);
  }, [search, category, minPrice, maxPrice, availabilityOnly, sortBy]);

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => loadGigs();
    window.addEventListener('demo-data-reset', handleReset);
    return () => window.removeEventListener('demo-data-reset', handleReset);
  }, []);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setAvailabilityOnly(false);
    setSortBy('relevant');
  };

  const hasActiveFilters = Boolean(
    search ||
      category !== 'All' ||
      minPrice ||
      maxPrice ||
      availabilityOnly ||
      sortBy !== 'relevant'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talent Discovery & Search</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Creator Services
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Discover vetted creative talent across specialized categories. Search keywords, filter by rate, and explore live availability.
        </p>
      </div>

      {/* Search & Top Controls */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators, services, skills, keywords..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[190px]">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-200 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Segmented Control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Additional Filters: Price & Availability */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Price Range inputs */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Budget ($):</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-600">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
              />
              <span>Available only (Immediate booking)</span>
            </label>
          </div>

          {/* Active Filter Count & Reset */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-slate-200">{gigs.length}</span> {gigs.length === 1 ? 'gig' : 'gigs'}
          {category !== 'All' && <span> in <span className="text-indigo-300 font-medium">{category}</span></span>}
        </div>
        {sortBy === 'relevant' && (
          <div className="text-slate-500 hidden sm:block">
            Sorted by relevance, availability, and creator ratings
          </div>
        )}
      </div>

      {/* Content State: Loading, Error, Empty, or Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GigCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={loadGigs}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : gigs.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No creator gigs found"
          description="We couldn't find any services matching your current filters. Try relaxing search criteria or resetting filters."
          actionText="Reset All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onBookClick={(g) => setBookingGig(g)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingGig && (
        <BookingModal
          gig={bookingGig}
          onClose={() => setBookingGig(null)}
          onBookingSuccess={() => {
            setBookingGig(null);
            loadGigs();
          }}
        />
      )}
    </div>
  );
};
