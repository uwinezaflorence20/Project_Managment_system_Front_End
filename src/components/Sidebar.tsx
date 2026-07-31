"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LogoMark } from "@/components/LogoMark";

const HomeIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
  />
);

const ProjectsIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M9 3v18M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
  />
);

const TeamIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-2.13a4 4 0 100-8 4 4 0 000 8zm6 4a4 4 0 00-3-3.87"
  />
);

const SettingsIcon = (
  <>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </>
);

const LogoutIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
  />
);

const AdminIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  />
);

function NavIcon({ path }: { path: React.ReactNode }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {path}
    </svg>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isBoardDetail = /^\/boards\/[^/]+$/.test(pathname);
  const isHome = pathname === "/dashboard" || isBoardDetail;
  const isProjects = pathname === "/boards";
  const isSettings = pathname === "/settings";
  const isAdmin = pathname.startsWith("/admin");

  const itemClass = (active: boolean) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
      active
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
    }`;

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-5 dark:border-white/10 dark:bg-[#0d0c1f]">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2 text-base font-bold text-slate-900 dark:text-white">
        <LogoMark />
        TaskTracker
      </Link>

      <nav className="flex flex-col gap-1">
        <Link href="/dashboard" className={itemClass(isHome)}>
          <NavIcon path={HomeIcon} />
          Home
        </Link>
        <Link href="/boards" className={itemClass(isProjects)}>
          <NavIcon path={ProjectsIcon} />
          Projects
        </Link>
        <span
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 dark:text-slate-600"
          title="Coming soon"
        >
          <NavIcon path={TeamIcon} />
          Team
        </span>
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-1">
        {user?.role === "admin" && (
          <Link href="/admin" className={itemClass(isAdmin)}>
            <NavIcon path={AdminIcon} />
            Admin
          </Link>
        )}
        <Link href="/settings" className={itemClass(isSettings)}>
          <NavIcon path={SettingsIcon} />
          Settings
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <NavIcon path={LogoutIcon} />
          Log out
        </button>
      </div>
    </aside>
  );
}
