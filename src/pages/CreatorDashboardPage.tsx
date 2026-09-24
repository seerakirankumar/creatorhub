import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchCreatorDashboard, acceptBooking, declineBooking } from '../services/api.js';
import { DashboardData, Booking } from '../types/index.js';
import { DashboardSkeleton } from '../components/SkeletonLoader.js';
import { EmptyState } from '../components/EmptyState.js';
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  DollarSign,
  AlertCircle,
  Check,
  X,
  PlusCircle,
  Sparkles,
  Info,
  ChevronDown,
} from 'lucide-react';

export const CreatorDashboardPage: React.FC = () => {
  const { activeCreator, setActiveCreator, creators, navigate, addToast } = useApp();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED'>('ALL');
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  const [declineReasonModalBooking, setDeclineReasonModalBooking] = useState<Booking | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const loadDashboard = async () => {
    if (!activeCreator) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCreatorDashboard(activeCreator.id);
      setDashboard(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load creator dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [activeCreator?.id]);

  // Listen to reset events
  useEffect(() => {
    const handleReset = () => loadDashboard();
    window.addEventListener('demo-data-reset', handleReset);
    return () => window.removeEventListener('demo-data-reset', handleReset);
  }, [activeCreator?.id]);

  const handleAccept = async (booking: Booking) => {
    setProcessingBookingId(booking.id);
    try {
      const result = await acceptBooking(booking.id);
      addToast({
        type: 'success',
        title: 'Booking Accepted',
        message: result.autoDeclinedCompetingRequests > 0
          ? `Booking confirmed! ${result.autoDeclinedCompetingRequests} competing pending request(s) on this gig were automatically declined.`
          : 'Booking accepted successfully. The gig has been marked booked.',
      });
      await loadDashboard();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept booking';
      addToast({
        type: 'error',
        title: 'Acceptance Error',
        message: msg,
      });
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleDeclineConfirm = async () => {
    if (!declineReasonModalBooking) return;
    setProcessingBookingId(declineReasonModalBooking.id);
    try {
      await declineBooking(declineReasonModalBooking.id, declineReason.trim() || undefined);
      addToast({
        type: 'info',
        title: 'Booking Declined',
        message: 'The booking status is set to Declined with your note. Client retains full visibility in My Bookings.',
      });
      setDeclineReasonModalBooking(null);
      setDeclineReason('');
      await loadDashboard();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to decline booking';
      addToast({
        type: 'error',
        title: 'Decline Error',
        message: msg,
      });
    } finally {
      setProcessingBookingId(null);
    }
  };

  const filteredBookings = dashboard?.bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Creator Identity Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Creator Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Creator Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Review incoming bookings, inspect client deliverables, and accept or decline requests.
          </p>
        </div>

        {/* Creator Persona Switcher & New Gig CTA */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={activeCreator?.id || ''}
              onChange={(e) => {
                const found = creators.find((c) => c.id === e.target.value);
                if (found) setActiveCreator(found);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  Creator: {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate('/post-gig')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Gig</span>
          </button>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold"
          >
            Retry Dashboard Load
          </button>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Total Gigs */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Total Gigs</span>
                <Briefcase className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {dashboard?.metrics.totalGigs ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">
                Published services in catalog
              </p>
            </div>

            {/* Metric 2: Pending Requests */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Pending Requests</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {dashboard?.metrics.pendingRequests ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">
                Inquiries awaiting review
              </p>
            </div>

            {/* Metric 3: Accepted */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Accepted Bookings</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {dashboard?.metrics.acceptedRequests ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">
                Active & completed engagements
              </p>
            </div>

            {/* Metric 4: Declined */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Declined</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-extrabold text-rose-400 font-mono">
                {dashboard?.metrics.declinedRequests ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">
                Retained with client recovery
              </p>
            </div>
          </div>

          {/* Incoming Bookings Section */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Incoming Client Bookings
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review project requirements, target dates, and accept or decline client inquiries.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                {(['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setBookingFilter(tab)}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      bookingFilter === tab
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                    {tab === 'PENDING' && (dashboard?.metrics.pendingRequests || 0) > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                        {dashboard?.metrics.pendingRequests}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List / Table */}
            {filteredBookings.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No bookings in this view"
                description={
                  bookingFilter === 'PENDING'
                    ? 'No pending client inquiries at this time. When clients request a gig, it will appear here.'
                    : 'No booking records match the selected filter.'
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const isPending = b.status === 'PENDING';
                  const isAccepted = b.status === 'ACCEPTED';
                  const isDeclined = b.status === 'DECLINED';
                  const isProcessing = processingBookingId === b.id;

                  return (
                    <div
                      key={b.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 transition-all"
                    >
                      {/* Booking Item Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">
                              {b.clientName}
                            </span>
                            {b.clientEmail && (
                              <span className="text-xs text-slate-500 font-mono">
                                ({b.clientEmail})
                              </span>
                            )}
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-xs text-slate-400 font-medium">
                              Gig: <span className="text-indigo-300">{b.gig?.title || 'Gig'}</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Inquired on {new Date(b.createdAt).toLocaleDateString()} at{' '}
                            {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Status Label (Accessible text + icon) */}
                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800 text-amber-300">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accepted Contract</span>
                            </span>
                          )}
                          {isDeclined && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800 text-rose-300">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Declined</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Scope Description */}
                      <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Project Requirements:
                        </div>
                        {b.projectDescription}
                      </div>

                      {/* Rejection Note if Declined */}
                      {b.rejectionReason && (
                        <div className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-lg border border-rose-900/60">
                          <span className="font-semibold block text-[11px] text-rose-400 mb-0.5">Decline Reason Note (Visible to Client):</span>
                          {b.rejectionReason}
                        </div>
                      )}

                      {/* Footer: Date, Price & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
                        <div className="flex items-center gap-5 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            <span>
                              Requested Delivery:{' '}
                              <strong className="text-slate-200">
                                {b.requestedDate && !isNaN(new Date(b.requestedDate).getTime())
                                  ? new Date(b.requestedDate).toLocaleDateString()
                                  : 'Flexible'}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Rate: <strong className="text-white font-mono">${b.gig?.rate || 0}</strong></span>
                          </div>
                        </div>

                        {/* Accept / Decline Action Buttons for PENDING */}
                        {isPending && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setDeclineReasonModalBooking(b);
                                setDeclineReason('');
                              }}
                              disabled={isProcessing}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-950/80 text-rose-300 hover:text-rose-200 border border-slate-800 hover:border-rose-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>

                            <button
                              onClick={() => handleAccept(b)}
                              disabled={isProcessing}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                              title="Accepts this booking and marks gig as reserved"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isProcessing ? 'Accepting...' : 'Accept'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Creator's Published Gigs Section */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Your Published Gigs ({dashboard?.gigs.length ?? 0})
                </h3>
                <p className="text-xs text-slate-400">
                  Live availability statuses and rates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard?.gigs.map((g) => (
                <div
                  key={g.id}
                  onClick={() => navigate(`/gigs/${g.id}`)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-700 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-400">{g.category}</span>
                    {g.availability ? (
                      <span className="text-emerald-400 text-[11px] font-medium">Available</span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-medium">Booked</span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1">
                    {g.title}
                  </h4>
                  <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-900 font-mono">
                    <span className="text-slate-500">Rate</span>
                    <span className="text-white font-bold">${g.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Decline Reason Modal */}
      {declineReasonModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setDeclineReasonModalBooking(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Decline Booking Request
              </h3>
              <button
                onClick={() => setDeclineReasonModalBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Declining this booking will update its status to <strong className="text-rose-400">DECLINED</strong>. The booking will not be deleted; the client will see your reason and be guided to alternative creators in {declineReasonModalBooking.gig?.category || 'this category'}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Decline Reason / Explanation (Optional):
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Current capacity is full for the requested week. Suggest booking for mid next month..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeclineReasonModalBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
