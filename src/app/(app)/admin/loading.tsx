export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" />
    </div>
  );
}
