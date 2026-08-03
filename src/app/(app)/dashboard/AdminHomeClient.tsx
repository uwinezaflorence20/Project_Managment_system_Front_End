"use client";

import type { AdminBoardSummary, AdminStats } from "@/lib/types";

const STAT_ICONS: Record<string, React.ReactNode> = {
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-2.13a4 4 0 100-8 4 4 0 000 8zm6 4a4 4 0 00-3-3.87"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  board: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 3v18M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
    />
  ),
  task: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14"
    />
  ),
};

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: keyof typeof STAT_ICONS;
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {STAT_ICONS[icon]}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500">{sublabel}</p>}
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  colorClass,
  title,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  title?: string;
}) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="group flex items-center gap-3" title={title}>
      <span className="w-24 shrink-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <div className="relative h-3.5 flex-1 rounded-sm bg-slate-100 dark:bg-white/5">
        <div
          className={`absolute inset-y-0 left-0 rounded-r-sm transition-all group-hover:brightness-110 ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function TeamCompositionChart({ totalAdmins, totalUsers }: { totalAdmins: number; totalUsers: number }) {
  const members = Math.max(0, totalUsers - totalAdmins);
  const max = Math.max(totalAdmins, members, 1);
  return (
    <ChartPanel title="Team composition" subtitle="Who has access to the platform">
      <div className="flex flex-col gap-3">
        <BarRow
          label="Admins"
          value={totalAdmins}
          max={max}
          colorClass="bg-amber-600 dark:bg-amber-600"
          title={`${totalAdmins} admin${totalAdmins === 1 ? "" : "s"}`}
        />
        <BarRow
          label="Members"
          value={members}
          max={max}
          colorClass="bg-indigo-600 dark:bg-indigo-500"
          title={`${members} member${members === 1 ? "" : "s"}`}
        />
      </div>
    </ChartPanel>
  );
}

function ProjectPerformanceChart({ boards }: { boards: AdminBoardSummary[] }) {
  const ranked = [...boards].sort((a, b) => b.progressPercent - a.progressPercent).slice(0, 8);
  return (
    <ChartPanel title="Project performance" subtitle="Share of tasks completed, by project">
      {ranked.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">No projects yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {ranked.map((board) => (
            <BarRow
              key={board.id}
              label={board.title}
              value={board.progressPercent}
              max={100}
              colorClass="bg-indigo-600 dark:bg-indigo-500"
              title={`${board.title} — ${board.completedTaskCount}/${board.taskCount} tasks done`}
            />
          ))}
          {boards.length > 8 && (
            <p className="text-xs text-slate-400 dark:text-slate-500">+{boards.length - 8} more in Projects</p>
          )}
        </div>
      )}
    </ChartPanel>
  );
}

export function AdminHomeClient({ stats, boards }: { stats: AdminStats; boards: AdminBoardSummary[] }) {
  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="rounded-xl bg-slate-900 px-6 py-5 ring-1 ring-slate-800 dark:bg-black/40 dark:ring-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Admin control panel</span>
        <h1 className="mt-1 text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-400">
          How the platform is doing — users, projects, and completion at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard icon="users" label="Users" value={stats.totalUsers} />
        <StatCard icon="shield" label="Admins" value={stats.totalAdmins} />
        <StatCard icon="board" label="Boards" value={stats.totalBoards} />
        <StatCard icon="task" label="Tasks" value={stats.totalTasks} />
        <StatCard
          icon="chart"
          label="Completion"
          value={`${stats.overallProgressPercent}%`}
          sublabel={`${stats.totalCompletedTasks}/${stats.totalTasks} tasks done`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TeamCompositionChart totalAdmins={stats.totalAdmins} totalUsers={stats.totalUsers} />
        <ProjectPerformanceChart boards={boards} />
      </div>
    </div>
  );
}
