"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { Board, DashboardStats } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { BoardDialog } from "@/components/BoardDialog";

export function DashboardClient({ initialStats }: { initialStats: DashboardStats }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleCreated(board: Board) {
    setStats((s) => ({
      ...s,
      projectCount: s.projectCount + 1,
      recentProjects: [board, ...s.recentProjects],
    }));
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across your projects.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>New project</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Projects" value={stats.projectCount} />
        <StatTile label="Completed tasks" value={stats.completedTasks} />
        <StatTile label="Pending tasks" value={stats.pendingTasks} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
          <Link href="/boards" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>

        {stats.recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">No projects yet</p>
            <p className="max-w-xs text-sm text-slate-500">
              Create your first project to start organizing tasks into columns.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Create a project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.recentProjects.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="flex flex-col gap-1 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{board.title}</h3>
                {board.description && (
                  <p className="line-clamp-2 text-sm text-slate-500">{board.description}</p>
                )}
                <span className="mt-3 text-xs text-slate-400">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BoardDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSaved={handleCreated}
      />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
