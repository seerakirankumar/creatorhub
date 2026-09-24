import React from 'react';

export const GigCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between animate-pulse">
      <div>
        {/* Creator header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-3 w-36 bg-slate-800/60 rounded" />
          </div>
        </div>

        {/* Title & Category */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-4/5 bg-slate-800 rounded" />
          <div className="h-5 w-3/5 bg-slate-800 rounded" />
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 mb-5">
          <div className="h-3.5 w-full bg-slate-800/50 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-800/50 rounded" />
        </div>
      </div>

      {/* Footer / Price & CTA */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-800 rounded" />
        <div className="h-8 w-24 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-28 flex flex-col justify-between">
            <div className="h-3.5 w-24 bg-slate-800 rounded" />
            <div className="h-7 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64" />
    </div>
  );
};
