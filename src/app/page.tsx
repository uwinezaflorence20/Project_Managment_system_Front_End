import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

const FEATURES = [
  {
    title: "Boards & columns",
    description: "Organize work into boards with fully customizable columns for every stage of your workflow.",
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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col gap-3">
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
            Kanban for real teams
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            FlowBoard
          </h1>
          <p className="mx-auto max-w-md text-base text-slate-600">
            Plan projects, organize columns, and drag tasks from To Do to Done —
            all in one clean workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </main>

      <section className="border-t border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything you need to ship projects
            </h2>
            <p className="mt-3 text-base text-slate-500">
              FlowBoard keeps your team focused on what&apos;s next, without the busywork.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">About FlowBoard</h2>
          <p className="text-base text-slate-600">
            FlowBoard is a lightweight Kanban-style project management platform built for small
            teams who want structure without the overhead. Create projects, break work into
            boards and columns, assign and prioritize tasks, and watch progress move from To Do
            to Done — all backed by a real database, not a spreadsheet.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-slate-400">
          <span>© {new Date().getFullYear()} FlowBoard</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-600">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-slate-600">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
