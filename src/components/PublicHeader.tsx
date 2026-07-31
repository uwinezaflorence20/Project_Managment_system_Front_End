import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { ThemeToggle } from "@/components/ThemeToggle";

export function PublicHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <LogoMark />
          TaskTracker
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-white/80 dark:hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
