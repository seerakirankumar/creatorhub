import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  PlusCircle,
  Compass,
  CalendarCheck,
  LayoutDashboard,
  BookmarkCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const FeaturesShowcase: React.FC = () => {
  const { navigate, setRole } = useApp();
  const [activeTab, setActiveTab] = useState<number>(0);

  const features = [
    {
      id: 1,
      badge: 'Service Publishing',
      title: 'Post a Gig',
      persona: 'Creator Flow',
      icon: PlusCircle,
      accent: 'from-indigo-500 to-violet-600',
      tagColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
      actionLabel: 'Publish a Gig Now',
      route: '/post-gig',
      setRoleTo: 'CREATOR' as const,
      summary:
        'A creator lists a service with title, category, starting rate, deliverables description, and live booking availability.',
      highlights: [
        'Structured service schema: Title, Category, Rate ($), and Deliverables Description',
        'Live interactive card preview rendered in real-time as you enter service details',
        'Immediate database insertion with direct link to the live marketplace gig',
        'Persistent storage and real-time indexing across search filters',
      ],
    },
    {
      id: 2,
      badge: 'Talent Discovery',
      title: 'Browse & Search',
      persona: 'Marketplace Flow',
      icon: Compass,
      accent: 'from-cyan-500 to-blue-600',
      tagColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
      actionLabel: 'Explore Marketplace',
      route: '/marketplace',
      setRoleTo: 'CLIENT' as const,
      summary:
        'A marketplace page listing all creator gigs, searchable by keywords and filterable by category, budget, and live availability.',
      highlights: [
        'Multi-factor search across titles, creator names, and skills',
        'Interactive category filters (Video, Design, Code, Writing, etc.)',
        'Price range filter and "Available Only" toggle',
        'Smart relevance ranking engine prioritizing bookable gigs',
      ],
    },
    {
      id: 3,
      badge: 'Instant Booking',
      title: 'Book a Gig',
      persona: 'Client Flow',
      icon: CalendarCheck,
      accent: 'from-emerald-500 to-teal-600',
      tagColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
      actionLabel: 'Find & Book a Gig',
      route: '/marketplace',
      setRoleTo: 'CLIENT' as const,
      summary:
        'A client books a creator via an intuitive booking form and receives an instant confirmation screen with booking reference and status.',
      highlights: [
        'Structured booking form: Client Name, Email, Deliverables Scope, and Target Date',
        'Real booking insertion into database with concurrency safety',
        'Immediate confirmation view with unique booking reference ID',
        'Initial order state automatically set to "Pending Creator Review"',
      ],
    },
    {
      id: 4,
      badge: 'Creator Console',
      title: 'Creator Dashboard',
      persona: 'Creator Flow',
      icon: LayoutDashboard,
      accent: 'from-amber-500 to-orange-600',
      tagColor: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      actionLabel: 'Open Creator Dashboard',
      route: '/creator-dashboard',
      setRoleTo: 'CREATOR' as const,
      summary:
        'A creator sees all incoming bookings and can accept or decline each with 1-click or provide an explanatory reason.',
      highlights: [
        'Live summary metrics: Inquiries, Pending Review, Confirmed Bookings, Pipeline Value',
        '1-Click Accept with automatic availability updates',
        '1-Click Decline modal with customizable rejection reason note',
        'Dynamic creator account switcher to manage different creator portfolios',
      ],
    },
    {
      id: 5,
      badge: 'Order Tracking',
      title: 'My Bookings',
      persona: 'Client Flow',
      icon: BookmarkCheck,
      accent: 'from-violet-500 to-purple-600',
      tagColor: 'bg-violet-950/80 text-violet-300 border-violet-800/80',
      actionLabel: 'View Client Bookings',
      route: '/my-bookings',
      setRoleTo: 'CLIENT' as const,
      summary:
        'A client tracks all their requested bookings with real-time status badges: Pending, Accepted, or Declined.',
      highlights: [
        'Filterable by live status: Pending, Accepted, or Declined',
        'Order details: deliverables brief, requested deadlines, and agreed rates',
        'Rejection feedback display for declined bookings with 1-click alternative discovery',
        'Client switcher to inspect bookings under any client name',
      ],
    },
  ];

  const current = features[activeTab];

  const handleLaunch = (feature: typeof features[0]) => {
    setRole(feature.setRoleTo);
    navigate(feature.route);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Capabilities</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          How You Can Monetize & Collaborate
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Empowering creators to publish gigs and clients to discover, book, and track specialized creative services.
        </p>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none justify-start sm:justify-center">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          const isSelected = activeTab === idx;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{feat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Feature Detail Card */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Description & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${current.tagColor}`}>
                {current.badge}
              </span>
              <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                {current.persona}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {current.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {current.summary}
              </p>
            </div>

            {/* Checklist Highlights */}
            <div className="space-y-2.5 pt-1">
              {current.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Launch Action */}
            <div className="pt-3">
              <button
                onClick={() => handleLaunch(current)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all group"
              >
                <span>{current.actionLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Workflow Overview */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
              <span className="font-mono text-slate-400 font-semibold">{current.title} Details</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live on Platform
              </span>
            </div>

            {activeTab === 0 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wide">Service Details</span>
                  <div className="text-slate-200 font-semibold">Enter your real service title & deliverables description</div>
                  <p className="text-[11px] text-slate-400">Specify exactly what deliverables and timelines you offer.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Rate & Category</span>
                  <div className="text-slate-200 font-semibold">Set transparent pricing ($) & choose category</div>
                  <p className="text-[11px] text-slate-400">Classify under Video, Design, Code, Writing, Marketing, etc.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wide">Instant Publication</span>
                  <div className="text-slate-200 font-semibold">Live on marketplace immediately</div>
                  <p className="text-[11px] text-slate-400">Clients can view and submit bookings directly.</p>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wide">Search & Discovery</span>
                  <div className="text-slate-200 font-semibold">Real-time keyword search across all gigs</div>
                  <p className="text-[11px] text-slate-400">Matches service titles, descriptions, and creator profiles.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wide">Filters</span>
                  <div className="text-slate-200 font-semibold">Filter by category, budget, and availability</div>
                  <p className="text-[11px] text-slate-400">Quickly narrow down to available services that fit project budgets.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Smart Relevance Ranking</span>
                  <div className="text-slate-200 font-semibold">Fair discovery algorithm for all creators</div>
                  <p className="text-[11px] text-slate-400">Elevates available gigs and provides boost for new creators.</p>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Structured Form</span>
                  <div className="text-slate-200 font-semibold">Provide project scope & target completion date</div>
                  <p className="text-[11px] text-slate-400">Detail your project requirements and expected delivery timeline.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wide">Instant Confirmation</span>
                  <div className="text-slate-200 font-semibold">Unique Booking Reference generated</div>
                  <p className="text-[11px] text-slate-400">Initial state registered as "Pending Creator Review".</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wide">Availability Protection</span>
                  <div className="text-slate-200 font-semibold">Atomic concurrency protection</div>
                  <p className="text-[11px] text-slate-400">Multiple pending inquiries allowed until creator confirms one.</p>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wide">Review Inquiries</span>
                  <div className="text-slate-200 font-semibold">Inspect client briefs, deadlines, and pricing</div>
                  <p className="text-[11px] text-slate-400">See all incoming client requests grouped by live status.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">1-Click Accept</span>
                  <div className="text-slate-200 font-semibold">Confirms contract & closes competing pending requests</div>
                  <p className="text-[11px] text-slate-400">Guarantees zero double-booking on confirmed services.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wide">Decline with Note</span>
                  <div className="text-slate-200 font-semibold">Provides feedback note without deleting record</div>
                  <p className="text-[11px] text-slate-400">Client retains order audit trail and can find alternative talent.</p>
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-violet-400 uppercase font-bold tracking-wide">Order Tracking</span>
                  <div className="text-slate-200 font-semibold">Real-time status: Pending, Accepted, or Declined</div>
                  <p className="text-[11px] text-slate-400">Full transparency into every project request submitted.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wide">Client Identity Filter</span>
                  <div className="text-slate-200 font-semibold">View orders by client name or see all bookings</div>
                  <p className="text-[11px] text-slate-400">Easily switch between different client personas without passwords.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">Recovery Actions</span>
                  <div className="text-slate-200 font-semibold">1-Click alternative discovery for declined orders</div>
                  <p className="text-[11px] text-slate-400">Quickly find similar available creators in the same category.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
