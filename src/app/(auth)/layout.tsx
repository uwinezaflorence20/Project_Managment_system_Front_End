import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AuthIllustration } from "@/components/AuthIllustration";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 bg-white dark:bg-[#0a0918]">
      <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <LogoMark />
            TaskTracker
          </Link>
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <div className="hidden w-1/2 lg:block">
        <AuthIllustration />
      </div>
    </div>
  );
}
