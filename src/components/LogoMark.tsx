const DOT_COLORS = ["bg-pink-500", "bg-cyan-400", "bg-amber-400", "bg-violet-500"];

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`grid grid-cols-2 gap-0.5 ${className}`} aria-hidden="true">
      {DOT_COLORS.map((color, i) => (
        <span key={i} className={`rounded-[2px] ${color}`} />
      ))}
    </span>
  );
}
