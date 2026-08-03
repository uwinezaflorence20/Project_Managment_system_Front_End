"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSearch } from "@/lib/search-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsBell } from "@/components/NotificationsBell";

export function TopBar() {
  const { user, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!isMenuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3 dark:border-white/10 dark:bg-[#0a0918]">
      <div className="relative w-full max-w-xs">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-full border-0 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationsBell />
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={isMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
            >
              {initials}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
                <div className="border-b border-slate-100 px-4 py-2.5 dark:border-white/5">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
