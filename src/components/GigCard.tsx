import React from 'react';
import { Gig } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
  onBookClick?: (gig: Gig) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onBookClick }) => {
  const { navigate } = useApp();

  const creator = gig.creator;
  const initials = creator?.name
    ? creator.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CR';

  const handleCardClick = () => {
    navigate(`/gigs/${gig.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
    >
      <div>
        {/* Creator Identity Header */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {creator?.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
                loading="lazy"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 ring-1 ring-indigo-800">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                {creator?.name || 'Creator'}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {creator?.title || 'Digital Professional'}
              </div>
            </div>
          </div>

          {/* Availability State */}
          <div className="shrink-0 flex items-center gap-1.5 text-xs">
            {gig.availability ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Available</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Booked</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2 leading-snug mb-2">
          {gig.title}
        </h3>

        {/* Quiet Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-medium text-slate-300">{gig.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Verified Skill</span>
          {typeof gig.rankingScore === 'number' && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-indigo-400 font-mono text-[11px]">Rank {Math.round(gig.rankingScore)}</span>
            </>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {gig.description}
        </p>
      </div>

      {/* Footer: Price & Direct Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-2">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block leading-none mb-1">
            Starting rate
          </span>
          <span className="text-base font-bold text-white font-mono">
            ${gig.rate}
          </span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCardClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            View Gig
          </button>

          {gig.availability && onBookClick && (
            <button
              onClick={() => onBookClick(gig)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
