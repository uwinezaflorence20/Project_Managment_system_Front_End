export function AuthIllustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-indigo-500 to-blue-600 dark:bg-[#0d0c22] dark:from-transparent dark:to-transparent dark:bg-none">
      <div className="absolute hidden h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:block" aria-hidden="true" />
      <div
        className="absolute -bottom-10 -right-10 hidden h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl dark:block"
        aria-hidden="true"
      />
      <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl dark:hidden" aria-hidden="true" />

      <div className="relative flex h-96 w-56 flex-col items-center justify-center gap-4 rounded-[2.5rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-[#141329] dark:backdrop-blur-none">
        <div className="h-1.5 w-10 rounded-full bg-white/40 dark:bg-white/10" aria-hidden="true" />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg dark:bg-linear-to-br dark:from-cyan-400 dark:via-fuchsia-500 dark:to-violet-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-600 dark:bg-[#141329] dark:bg-none">
            <svg className="h-8 w-8 text-white dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 12l1.8 1.8L14.5 10" />
            </svg>
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-24 rounded bg-white/60 dark:bg-white/15" />
          <div className="h-2 w-16 rounded bg-white/30 dark:bg-white/10" />
        </div>
      </div>

      <div className="absolute bottom-16 left-10 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-[#141329] dark:backdrop-blur-none">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white dark:bg-cyan-400/20 dark:text-cyan-300">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
            />
          </svg>
        </span>
        <span className="text-xs font-medium text-white/90 dark:text-white/80">Your work, secured</span>
      </div>
    </div>
  );
}
