import React from 'react';

/**
 * LoadingSkeleton – pulsing placeholder cards shown while analytics compute.
 * Renders 6 KPI skeletons + 4 chart skeletons.
 */
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-800 light:bg-slate-200 ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    {/* KPI row */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 flex flex-col gap-3 transition-colors duration-200">
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-7 w-28" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      ))}
    </div>

    {/* Chart pairs */}
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, j) => (
          <div key={j} className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 transition-colors duration-200">
            <SkeletonBox className="h-4 w-40 mb-2" />
            <SkeletonBox className="h-3 w-56 mb-6" />
            <SkeletonBox className="h-56 w-full rounded-xl" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default React.memo(LoadingSkeleton);
