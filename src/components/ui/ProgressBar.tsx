export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-400"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
