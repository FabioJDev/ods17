export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-gray-200 rounded-full" />
        <div className="w-14 h-5 bg-gray-100 rounded-full" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-7 bg-gray-200 rounded-lg w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-50 rounded w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className={`h-4 rounded flex-1 ${j === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}
                style={{ maxWidth: j === cols - 1 ? '60%' : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 260 }: { height?: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full flex items-end gap-3 px-4 pb-6 pt-4">
        {[65, 40, 85, 55, 70, 45, 80, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-10 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-100 rounded ${
            i === lines - 1 ? 'w-3/4' : i === 0 ? 'w-full' : 'w-5/6'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded-lg w-48" />
        <div className="h-4 bg-gray-100 rounded w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
          <SkeletonChart />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
          <SkeletonChart />
        </div>
      </div>
    </div>
  );
}
