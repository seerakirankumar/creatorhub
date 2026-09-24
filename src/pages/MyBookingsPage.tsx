import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchBookings } from '../services/api.js';
import { Booking, BookingStatus } from '../types/index.js';
import { EmptyState } from '../components/EmptyState.js';
import {
  BookmarkCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Compass,
  ArrowRight,
  ExternalLink,
  DollarSign,
  User,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const {
    activeClientName,
    setActiveClientName,
    navigate,
    setPreselectedCategory,
  } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allRealClients, setAllRealClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [filterMode, setFilterMode] = useState<'SPECIFIC' | 'ALL_CLIENTS'>('SPECIFIC');

  const loadClientBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all bookings to discover real client names
      const allBookings = await fetchBookings({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });

      const uniqueClients = Array.from(
        new Set(allBookings.map((b) => b.clientName.trim()))
      ).filter(Boolean);
      setAllRealClients(uniqueClients);

      if (filterMode === 'ALL_CLIENTS' || !activeClientName.trim()) {
        setBookings(allBookings);
      } else {
        const filtered = allBookings.filter(
          (b) => b.clientName.toLowerCase() === activeClientName.trim().toLowerCase()
        );
        setBookings(filtered);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve bookings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientBookings();
  }, [activeClientName, statusFilter, filterMode]);

  // Listen to reset events
  useEffect(() => {
    const handleReset = () => loadClientBookings();
    window.addEventListener('demo-data-reset', handleReset);
    return () => window.removeEventListener('demo-data-reset', handleReset);
  }, [activeClientName, statusFilter, filterMode]);

  // Browse Similar Gigs in same category
  const handleBrowseSimilar = (category?: string) => {
    if (category) {
      setPreselectedCategory(category);
    }
    navigate('/marketplace');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Client Persona Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider bg-violet-950/60 border border-violet-800/60 px-2.5 py-1 rounded-lg mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Order Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Order History (My Bookings)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Track real submitted bookings with live statuses: <span className="text-amber-400 font-semibold">Pending</span>, <span className="text-emerald-400 font-semibold">Accepted</span>, or <span className="text-rose-400 font-semibold">Declined</span>.
          </p>
        </div>

        {/* Client quick filter */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setFilterMode('ALL_CLIENTS');
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                filterMode === 'ALL_CLIENTS'
                  ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              All Clients ({allRealClients.length})
            </button>

            {allRealClients.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setActiveClientName(name);
                  setFilterMode('SPECIFIC');
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  filterMode === 'SPECIFIC' && activeClientName === name
                    ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Client Name:</span>
            <input
              type="text"
              value={activeClientName}
              onChange={(e) => {
                setActiveClientName(e.target.value);
                setFilterMode('SPECIFIC');
              }}
              placeholder="Search by client name"
              className="bg-transparent border-none text-white font-medium focus:outline-none w-32 placeholder-slate-600"
            />
            <button
              onClick={loadClientBookings}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
          {(['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Bookings' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/marketplace')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Marketplace</span>
        </button>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-36" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={loadClientBookings}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              {activeClientName && filterMode === 'SPECIFIC'
                ? `No bookings recorded yet for "${activeClientName}". Book an available creator gig on the marketplace to start collaborating!`
                : 'No bookings recorded in the platform database yet. Browse the marketplace and book a gig to insert your first request!'}
            </p>
          </div>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Marketplace & Book</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPending = booking.status === 'PENDING';
            const isAccepted = booking.status === 'ACCEPTED';
            const isDeclined = booking.status === 'DECLINED';

            return (
              <div
                key={booking.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-sm"
              >
                {/* Header: Service Title & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Booking ID: <span className="font-mono text-slate-300">{booking.id}</span></span>
                      <span>•</span>
                      <span>Client: <span className="text-white font-medium">{booking.clientName}</span></span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {booking.gig?.title || 'Creator Service'}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Creator Review</span>
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Booking Accepted</span>
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Booking Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Creator Info */}
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                      Creator
                    </span>
                    <div className="flex items-center gap-2.5">
                      {booking.creator?.avatar ? (
                        <img
                          src={booking.creator.avatar}
                          alt={booking.creator.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-800"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                          {booking.creator?.name?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-200">
                          {booking.creator?.name || 'Creator'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {booking.gig?.category || 'Service'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agreed Rate */}
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                      Rate
                    </span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      ${booking.gig?.rate || 0}
                    </div>
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                      Target Completion
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {booking.requestedDate && !isNaN(new Date(booking.requestedDate).getTime())
                          ? new Date(booking.requestedDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Flexible Timeline'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Description Scope */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">
                    Project Deliverables & Brief:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {booking.projectDescription}
                  </p>
                </div>

                {/* Declined Note and Recovery */}
                {isDeclined && (
                  <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-rose-300">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <div>
                        <span className="font-semibold block">Creator Rejection Feedback:</span>
                        <p className="text-rose-200/90 text-xs mt-0.5">
                          {booking.rejectionReason || 'Creator cannot accommodate this request at this time.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-slate-400">
                        Explore alternative available creators:
                      </span>
                      <button
                        onClick={() => handleBrowseSimilar(booking.gig?.category)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span>Find Similar {booking.gig?.category || ''} Gigs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
