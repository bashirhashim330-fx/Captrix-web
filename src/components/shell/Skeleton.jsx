// Loading placeholders that mirror the real Overview layout (shimmer is
// disabled under prefers-reduced-motion).
export const Bone = ({ className = '' }) => <span className={`cx-bone block rounded-lg ${className}`} aria-hidden="true"></span>;

export const OverviewSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto" role="status" aria-label="Loading your dashboard">
    <div><Bone className="h-7 w-64 max-w-full" /><Bone className="h-4 w-44 mt-2" /></div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
      <div className="cx-t1 rounded-2xl border p-6 xl:col-span-8"><Bone className="h-4 w-32" /><Bone className="h-10 w-56 mt-4" /><Bone className="h-3 w-40 mt-3" /><Bone className="h-2 w-full mt-8" /></div>
      <div className="cx-t1 rounded-2xl border p-6 xl:col-span-4"><Bone className="h-4 w-28" /><Bone className="h-24 w-full mt-4" /><Bone className="h-2 w-full mt-5" /></div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map(k => <div key={k} className="cx-t1 rounded-xl border p-4"><Bone className="h-3 w-20" /><Bone className="h-6 w-24 mt-3" /><Bone className="h-8 w-full mt-3" /></div>)}
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);
