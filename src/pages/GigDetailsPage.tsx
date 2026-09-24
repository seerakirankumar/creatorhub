import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchGigById, fetchGigs } from '../services/api.js';
import { Gig } from '../types/index.js';
import { GigCard } from '../components/GigCard.js';
import { BookingModal } from '../components/BookingModal.js';
import { EmptyState } from '../components/EmptyState.js';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  Share2,
} from 'lucide-react';

interface GigDetailsPageProps {
  gigId: string;
}

export const GigDetailsPage: React.FC<GigDetailsPageProps> = ({ gigId }) => {
  const { navigate, addToast } = useApp();
  const [gig, setGig] = useState<Gig | null>(null);
  const [similarGigs, setSimilarGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadGigDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGigById(gigId);
        setGig(data);

        // Fetch similar gigs in the same category
        const similar = await fetchGigs({
          category: data.category,
          availability: 'all',
        });
        setSimilarGigs(similar.filter((g) => g.id !== data.id).slice(0, 3));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load gig details';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadGigDetails();
  }, [gigId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Gig share URL copied to clipboard.',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 w-3/4 bg-slate-800 rounded" />
            <div className="h-4 w-1/3 bg-slate-800 rounded" />
            <div className="h-48 bg-slate-900 rounded-xl" />
          </div>
          <div className="h-64 bg-slate-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Gig Not Found"
          description={error || "The service gig you're looking for does not exist or has been removed."}
          actionText="Back to Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  const creator = gig.creator;
  const initials = creator?.name
    ? creator.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CR';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main Gig Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Gig Details & Creator Bio */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <span className="font-semibold text-indigo-400">{gig.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Published {new Date(gig.createdAt).toLocaleDateString()}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">Verified Listing</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {gig.title}
            </h1>

            {/* Creator Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                {creator?.avatar ? (
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-950 text-indigo-300 font-bold text-sm flex items-center justify-center">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{creator?.name}</span>
                    <span className="text-indigo-400 text-xs">✓</span>
                  </div>
                  <div className="text-xs text-slate-400">{creator?.title || 'Digital Professional'}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Rating</span>
                <span className="text-sm font-bold text-amber-400">★ {creator?.rating || 5.0}</span>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">
              Service Scope & Details
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          {/* Creator Bio Section */}
          {creator?.bio && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">
                About the Creator
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {creator.bio}
              </p>
            </div>
          )}

          {/* Included Features */}
          <div className="border border-slate-800/80 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Full commercial rights and deliverables included</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Direct communication with the creator</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Protected booking lifecycle & verified communication</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Revision round included in agreed scope</span>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card / Pricing Box */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  Service Rate
                </span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  ${gig.rate}
                </span>
              </div>

              <div>
                {gig.availability ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Available</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Currently Booked</span>
                  </span>
                )}
              </div>
            </div>

            {/* Availability details */}
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Category</span>
                <span className="text-slate-200 font-medium">{gig.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Turnaround</span>
                <span className="text-slate-200 font-medium">3–7 business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Booking Guarantee</span>
                <span className="text-slate-200 font-medium">Safe Escrow Pipeline</span>
              </div>
            </div>

            {/* Action Button */}
            {gig.availability ? (
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Book This Gig</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full py-3.5 bg-slate-800 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed"
                >
                  Currently Unavailable (Booked)
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  This gig is currently fulfilled under an active client contract.
                </p>
              </div>
            )}

            <button
              onClick={handleShare}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Gig URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar Gigs Section */}
      {similarGigs.length > 0 && (
        <section className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Similar Services in {gig.category}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore alternative creators and services in this specialty
              </p>
            </div>
            <button
              onClick={() => {
                navigate('/marketplace');
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarGigs.map((item) => (
              <GigCard key={item.id} gig={item} />
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          gig={gig}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={() => {
            setIsBookingOpen(false);
          }}
        />
      )}
    </div>
  );
};
