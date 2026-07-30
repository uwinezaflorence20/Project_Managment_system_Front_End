export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-slate-100 p-3">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            {Array.from({ length: 3 }).map((__, j) => (
              <div key={j} className="h-20 animate-pulse rounded-md bg-white shadow-sm" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
