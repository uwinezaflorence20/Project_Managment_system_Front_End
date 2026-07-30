export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-md bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-200" />
        ))}
      </div>
    </div>
  );
}
