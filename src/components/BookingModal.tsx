import React, { useState } from 'react';
import { Gig, Booking } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { createBooking } from '../services/api.js';
import {
  X,
  Calendar,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface BookingModalProps {
  gig: Gig | null;
  onClose: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  gig,
  onClose,
  onBookingSuccess,
}) => {
  const { activeClientName, setActiveClientName, addToast, navigate } = useApp();

  const [clientName, setClientName] = useState(activeClientName || '');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [requestedDate, setRequestedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!gig) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Please enter your client name');
      return;
    }
    if (projectDescription.trim().length < 10) {
      setFormError('Please provide a project description with at least 10 characters');
      return;
    }
    if (!requestedDate) {
      setFormError('Please select a target completion date');
      return;
    }
    const selectedDate = new Date(requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setFormError('Target completion date cannot be in the past');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        gigId: gig.id,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || undefined,
        projectDescription: projectDescription.trim(),
        requestedDate,
      });

      // Update active client name so they can see their real bookings immediately in My Bookings
      setActiveClientName(clientName.trim());
      setConfirmedBooking(newBooking);
      addToast({
        type: 'success',
        title: 'Booking Request Submitted',
        message: `Your booking for "${gig.title}" has been sent to ${gig.creator?.name || 'the creator'}.`,
      });

      if (onBookingSuccess) {
        onBookingSuccess(newBooking);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit booking request';
      setFormError(msg);
      addToast({
        type: 'error',
        title: 'Booking Request Failed',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span>Book a Service</span>
            </div>
            <h2 className="text-base font-bold text-white">
              {confirmedBooking ? 'Booking Confirmation' : 'Request Service Booking'}
            </h2>
            <p className="text-xs text-slate-400">
              {confirmedBooking
                ? 'Your order request has been registered in the database'
                : 'Submit your project details directly to the creator'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {confirmedBooking ? (
            /* Confirmation View */
            <div className="text-center py-4 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  Booking Registered
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
                  Request Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Your request has been routed to <strong>{gig.creator?.name || 'the creator'}</strong> and is awaiting review in the Creator Dashboard.
                </p>
              </div>

              {/* Status Indicator Card */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Status</span>
                  <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Creator Review</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Booking Reference</span>
                  <span className="font-mono text-slate-300 text-[11px] font-semibold">{confirmedBooking.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Service</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px]">
                    {gig.title}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Client Name</span>
                  <span className="text-white font-semibold">{confirmedBooking.clientName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Rate</span>
                  <span className="text-emerald-400 font-mono font-bold">${gig.rate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Completion</span>
                  <span className="text-slate-200 font-medium">
                    {new Date(confirmedBooking.requestedDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Gig Snapshot */}
              <div className="md:col-span-2 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    {gig.creator?.avatar && (
                      <img
                        src={gig.creator.avatar}
                        alt={gig.creator.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800"
                      />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {gig.creator?.name}
                      </div>
                      <div className="text-[11px] text-indigo-400 font-medium">
                        {gig.category}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 mb-2 leading-snug">
                    {gig.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                    Service Rate
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    ${gig.rate}
                  </div>
                </div>
              </div>

              {/* Right Column: Booking Form */}
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4 text-xs">
                {formError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>{formError}</div>
                  </div>
                )}

                {/* Client Name */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full name or company"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Client Email */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. you@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Target Date */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Target Delivery Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Project Deliverables & Requirements *</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project requirements, goals, assets you will provide, and expected deliverables..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Concurrency Notice */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Submitting creates a Pending request. The creator will review and accept or decline.</span>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-3.5 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <span>Submit Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
