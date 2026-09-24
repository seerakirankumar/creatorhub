import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { createGig } from '../services/api.js';
import { GigCategory } from '../types/index.js';
import { GigCard } from '../components/GigCard.js';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  DollarSign,
  Layers,
  FileText,
  User,
  Check,
} from 'lucide-react';

const CATEGORIES: Exclude<GigCategory, 'All'>[] = [
  'Video',
  'Design',
  'Programming',
  'Writing',
  'Marketing',
  'Photography',
  'Music',
  'Education',
  'Other',
];

export const PostGigPage: React.FC = () => {
  const { activeCreator, navigate, addToast, refreshCreators } = useApp();

  const [creatorName, setCreatorName] = useState(activeCreator?.name || 'Kiran Kumar');
  const [creatorTitle, setCreatorTitle] = useState(activeCreator?.title || 'Professional Creator');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<GigCategory, 'All'>>('Video');
  const [rate, setRate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedGigId, setPublishedGigId] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!creatorName.trim()) {
      newErrors.creatorName = 'Creator name is required';
    }

    if (!title.trim()) {
      newErrors.title = 'Gig title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (title.trim().length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    const rateNum = Number(rate);
    if (!rate || isNaN(rateNum) || rateNum <= 0) {
      newErrors.rate = 'Please enter a valid rate in USD ($)';
    }

    if (!description.trim()) {
      newErrors.description = 'Service description and deliverables are required';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please provide at least 15 characters explaining your scope and deliverables';
    } else if (description.trim().length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const gig = await createGig({
        title: title.trim(),
        category,
        rate: Number(rate),
        description: description.trim(),
        availability,
        creatorId: activeCreator?.id,
        creatorName: creatorName.trim(),
      });

      setPublishedGigId(gig.id);
      await refreshCreators();

      addToast({
        type: 'success',
        title: 'Gig Published Successfully',
        message: `"${gig.title}" is now live on the marketplace.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish gig';
      setErrors({ form: msg });
      addToast({
        type: 'error',
        title: 'Publication Failed',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live preview mockup gig
  const previewGig = {
    id: 'preview-id',
    creatorId: activeCreator?.id || 'temp',
    creator: {
      id: activeCreator?.id || 'temp',
      name: creatorName || 'Creator Name',
      avatar:
        activeCreator?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      title: creatorTitle || 'Specialist',
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: title || 'Your Service Title Will Appear Here',
    category,
    description:
      description ||
      'Your comprehensive scope of work, deliverables, and service terms will appear here as you type. Clients will review this description before booking.',
    rate: Number(rate) || 0,
    availability,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (publishedGigId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Gig Published To Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Service Gig Is Now Live!
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Your service gig has been inserted into the live database and is immediately discoverable across the marketplace.
          </p>
        </div>

        {/* Gig Summary Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Creator</span>
            <span className="text-white font-semibold">{creatorName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Service Title</span>
            <span className="text-white font-semibold truncate max-w-[220px]">{title}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Category</span>
            <span className="text-indigo-400 font-semibold">{category}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Rate</span>
            <span className="text-emerald-400 font-mono font-bold">${rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Availability</span>
            <span className="text-emerald-400 font-medium">Available for Booking</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/gigs/${publishedGigId}`)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <span>View Live Gig</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
          >
            Browse Marketplace
          </button>
          <button
            onClick={() => {
              setPublishedGigId(null);
              setTitle('');
              setDescription('');
              setRate('');
            }}
            className="px-4 py-2.5 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
          >
            Post Another Gig
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="space-y-1.5 border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Monetization</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Publish a Creator Gig
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          List a service with title, category, starting rate, deliverables description, and live booking availability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Creator Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Creator Name *</span>
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 ${
                    errors.creatorName
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                {errors.creatorName && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.creatorName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={creatorTitle}
                  onChange={(e) => setCreatorTitle(e.target.value)}
                  placeholder="e.g. Senior Video Editor"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1"
                />
              </div>
            </div>

            {/* Gig Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gig Title *</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Video Editing for YouTube & Reels"
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 ${
                  errors.title
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              <div className="flex items-center justify-between text-[11px] mt-1">
                {errors.title ? (
                  <span className="text-rose-400 font-medium">{errors.title}</span>
                ) : (
                  <span className="text-slate-500">A clear, descriptive title helps clients find your service</span>
                )}
                <span className="text-slate-500">{title.length}/120</span>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Category *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      category === cat
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.category}</p>
              )}
            </div>

            {/* Rate & Pricing */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                <span>Starting Rate (USD $) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="e.g. 200"
                  className={`w-full bg-slate-950 border rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 font-mono ${
                    errors.rate
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.rate && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.rate}</p>
              )}
            </div>

            {/* Description & Deliverables */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Service Scope & Deliverables *</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain in detail what you provide, turn-around times, format of deliverables, software tools used, and revision policies..."
                className={`w-full bg-slate-950 border rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 leading-relaxed ${
                  errors.description
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              <div className="flex items-center justify-between text-[11px] mt-1">
                {errors.description ? (
                  <span className="text-rose-400 font-medium">{errors.description}</span>
                ) : (
                  <span className="text-slate-500">Provide clear deliverables for potential clients</span>
                )}
                <span className="text-slate-500">{description.length}/2000</span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Available for Immediate Booking
                </span>
                <span className="text-[11px] text-slate-400">
                  Allow clients to submit booking requests directly for this gig
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAvailability(!availability)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  availability ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={availability}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    availability ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                <span>Publishing Gig to Database...</span>
              ) : (
                <>
                  <span>Publish Gig</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Card Preview</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Real-time rendering</span>
          </div>

          <div className="pointer-events-none opacity-95">
            <GigCard gig={previewGig} />
          </div>
        </div>
      </div>
    </div>
  );
};
