import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { LogoMark } from "@/components/LogoMark";

const FEATURES = [
  {
    title: "Boards & columns",
    description: "Organize work into boards with fully customizable columns for every stage of your workflow.",
    color: "bg-pink-500/15 text-pink-500 dark:text-pink-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3v18M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
      />
    ),
  },
  {
    title: "Drag-and-drop",
    description: "Move tasks between columns and reorder boards instantly with smooth, keyboard-accessible drag-and-drop.",
    color: "bg-cyan-400/15 text-cyan-600 dark:text-cyan-300",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h.01M8 12h.01M8 17h.01M16 7h.01M16 12h.01M16 17h.01"
      />
    ),
  },
  {
    title: "Priorities & due dates",
    description: "Flag what matters with priority levels and due dates so nothing important slips through.",
    color: "bg-violet-500/15 text-violet-500 dark:text-violet-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Track progress",
    description: "See project and task counts at a glance from your dashboard, updated the moment work moves.",
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
];

const MEMBERS = [
  { name: "Sarah Kim", role: "Manager", color: "bg-pink-500", status: "bg-emerald-400" },
  { name: "Grace Owusu", role: "Member", color: "bg-cyan-400", status: "bg-emerald-400" },
  { name: "Daniel Reyes", role: "Member", color: "bg-violet-500", status: "bg-slate-400 dark:bg-slate-500" },
];

function GetStartedButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/register"
      className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 ${className}`}
    >
      Get started for free
    </Link>
  );
}

function DotField({ className = "" }: { className?: string }) {
  const colors = ["bg-pink-500", "bg-cyan-400", "bg-amber-400", "bg-violet-500", "bg-emerald-400"];
  return (
    <div className={`grid grid-cols-6 gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${colors[i % colors.length]} ${
            (i * 7) % 3 === 0 ? "opacity-90" : "opacity-30"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900 dark:bg-[#0a0918] dark:text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-8 pb-32 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <LogoMark className="h-7 w-7" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Task Tracker <span className="text-slate-400 dark:text-white/60">—</span> manager for small teams.
            </h1>
            <p className="max-w-md text-base text-slate-600 dark:text-slate-400">
              TaskTracker is a comprehensive tool for small companies and teams to organize
              projects, assign work, and finish it, easily.
            </p>
            <div>
              <GetStartedButton />
            </div>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <div className="absolute h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl dark:bg-fuchsia-600/20" aria-hidden="true" />
            <div className="absolute -right-4 top-2 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-4">
              <div className="w-56 -rotate-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#141329]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="h-2 w-3/4 rounded bg-slate-200 dark:bg-white/20" />
                  <div className="h-2 w-1/2 rounded bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-12 flex-1 rounded-md bg-linear-to-br from-fuchsia-500/40 to-violet-600/40" />
                  <div className="h-12 flex-1 rounded-md bg-linear-to-br from-cyan-400/30 to-blue-600/30" />
                </div>
              </div>
              <div className="ml-10 w-40 rotate-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#141329]">
                <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-white/20" />
                <div className="mt-3 h-8 rounded-md bg-linear-to-br from-amber-400/30 to-pink-500/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating product card, overlapping the hero */}
        <div className="relative z-10 mx-auto -mb-40 mt-16 max-w-2xl">
          <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#121130]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500/15 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Good morning</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Rica</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-pink-500/15 ring-1 ring-slate-200 dark:bg-pink-500/20 dark:ring-white/10" />
              <span className="h-8 w-8 rounded-full bg-cyan-400/15 ring-1 ring-slate-200 dark:bg-cyan-400/20 dark:ring-white/10" />
              <span className="h-8 w-8 rounded-full bg-amber-400/15 ring-1 ring-slate-200 dark:bg-amber-400/20 dark:ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Habit tagline */}
      <section className="px-6 pt-48 pb-20 text-center sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <h2 className="text-3xl font-bold sm:text-4xl">
            TaskTracker isn&apos;t a tool, it&apos;s a{" "}
            <span className="text-cyan-600 dark:text-cyan-400">Habit.</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            TaskTracker&apos;s consistency lands after just a few days, not months and months.
          </p>
          <GetStartedButton />
        </div>
      </section>

      {/* Finish it, not Trello */}
      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Finish it, it&apos;s not <span className="text-cyan-600 dark:text-cyan-400">Trello.</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Its unique features help you finish work, not just organize it.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-[#121130] dark:shadow-none"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${feature.color}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon}
                </svg>
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <GetStartedButton />
        </div>
      </section>

      {/* Members */}
      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Add members, assign managers, and supervise your team.
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#121130]">
          {MEMBERS.map((member, i) => (
            <div
              key={member.name}
              className={`flex items-center justify-between px-2 py-3 ${
                i !== MEMBERS.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${member.color}`}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                </div>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${member.status}`} />
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="relative overflow-hidden px-6 py-20 sm:px-8">
        <DotField className="pointer-events-none absolute -right-4 bottom-4 w-40 opacity-20 dark:opacity-40" />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How to use TaskTracker for your team</h2>
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-8 sm:flex-row">
          <div
            className="h-20 w-20 shrink-0 rounded-full bg-linear-to-br from-pink-500 via-fuchsia-500 to-violet-500 dark:bg-[conic-gradient(from_90deg,#ec4899,#22d3ee,#a855f7,#ec4899)]"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <p className="text-base text-slate-600 dark:text-slate-400">
              Sign up with your email, create your first project, and invite your team. No
              complicated onboarding, no wasted time — just tasks getting done.
            </p>
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                MP
              </span>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Mbabazi Patrick</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Team lead</p>
              </div>
            </div>
            <div className="flex justify-center sm:justify-start">
              <GetStartedButton />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-slate-500 dark:text-slate-500">
          <span className="flex items-center gap-2">
            <LogoMark className="h-4 w-4" />© {new Date().getFullYear()} TaskTracker
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-700 dark:hover:text-slate-300">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-slate-700 dark:hover:text-slate-300">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
