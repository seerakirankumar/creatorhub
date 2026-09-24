import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchGigById } from '../services/api.js';
import { Gig } from '../types/index.js';
import { BookingModal } from '../components/BookingModal.js';
import { EmptyState } from '../components/EmptyState.js';

interface BookGigPageProps {
  gigId: string;
}

export const BookGigPage: React.FC<BookGigPageProps> = ({ gigId }) => {
  const { navigate } = useApp();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGig() {
      try {
        setLoading(true);
        const data = await fetchGigById(gigId);
        setGig(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gig not found';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadGig();
  }, [gigId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 animate-pulse text-center">
        <div className="h-6 w-48 bg-slate-800 rounded mx-auto mb-4" />
        <div className="h-64 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="Gig Unavailable"
          description={error || "This service gig cannot be booked because it does not exist or has expired."}
          actionText="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <BookingModal
      gig={gig}
      onClose={() => navigate(`/gigs/${gig.id}`)}
      onBookingSuccess={() => navigate('/my-bookings')}
    />
  );
};
