"use client";

import { useEffect, useState } from "react";
import type { AdminBoardDetail, AdminBoardSummary } from "@/lib/types";
import { adminDeleteBoard, adminGetBoardDetail, adminListBoards } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BoardDialog } from "@/components/BoardDialog";
import { AdminBoardDetailDialog } from "@/components/AdminBoardDetailDialog";

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProjectCard({
  board,
  detail,
  onView,
  onDelete,
  isDeleting,
}: {
  board: AdminBoardSummary;
  detail: AdminBoardDetail | undefined;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const people = detail?.memberProgress;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md dark:bg-[#121130] dark:ring-white/10 dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-2">
        <button onClick={onView} className="min-w-0 text-left">
          <p className="truncate font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
            {board.title}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {board.ownerName} <span className="text-slate-400 dark:text-slate-500">({board.ownerEmail})</span>
          </p>
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Delete ${board.title}`}
          className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">Progress</span>
          <span className="text-slate-500 dark:text-slate-400">
            {board.completedTaskCount}/{board.taskCount} tasks · {board.progressPercent}%
          </span>
        </div>
        <ProgressBar percent={board.progressPercent} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-1.5">
          {!people ? (
            <span className="h-7 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-white/5" />
          ) : people.length === 0 ? (
            <span className="text-xs text-slate-400 dark:text-slate-500">No one assigned</span>
          ) : (
            <>
              {people.slice(0, 4).map((person) => (
                <span
                  key={person.userId}
                  title={`${person.name} — ${person.completedCount}/${person.assignedCount} tasks`}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700 ring-2 ring-white dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-[#121130]"
                >
                  {initialsFor(person.name)}
                </span>
              ))}
              {people.length > 4 && (
                <span
                  title={people
                    .slice(4)
                    .map((p) => p.name)
                    .join(", ")}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600 ring-2 ring-white dark:bg-white/10 dark:text-slate-300 dark:ring-[#121130]"
                >
                  +{people.length - 4}
                </span>
              )}
            </>
          )}
        </div>
        <button
          onClick={onView}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          View details →
        </button>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Created {new Date(board.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export function AdminBoardsClient({ initialBoards }: { initialBoards: AdminBoardSummary[] }) {
  const [boards, setBoards] = useState(initialBoards);
  const [boardDetails, setBoardDetails] = useState<Record<string, AdminBoardDetail>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingBoardId, setPendingBoardId] = useState<string | null>(null);
  const [viewingBoardId, setViewingBoardId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBoardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled(boards.map((b) => adminGetBoardDetail(b.id))).then((results) => {
      if (cancelled) return;
      setBoardDetails((prev) => {
        const next = { ...prev };
        results.forEach((result, i) => {
          if (result.status === "fulfilled") next[boards[i].id] = result.value;
        });
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards.length]);

  async function refreshBoards() {
    try {
      setBoards(await adminListBoards());
    } catch {
      // The board was already created/deleted successfully; a failed refresh
      // just means the list looks stale until the next reload.
    }
  }

  async function handleDeleteBoard(board: AdminBoardSummary) {
    setError(null);
    setPendingBoardId(board.id);
    const previous = boards;
    setBoards((list) => list.filter((b) => b.id !== board.id));
    try {
      await adminDeleteBoard(board.id);
    } catch (err) {
      setBoards(previous);
      setError(err instanceof ApiError ? err.message : "Failed to delete board.");
    } finally {
      setPendingBoardId(null);
      setDeleteTarget(null);
    }
  }

  function handleCreated() {
    refreshBoards();
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every project on the platform, with progress and who&apos;s on it.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>New project</Button>
      </div>

      <ErrorBanner message={error} />

      {boards.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 py-24 text-center dark:border-white/10">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No projects yet</p>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Create the first project to start organizing tasks into columns.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>Create a project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <ProjectCard
              key={board.id}
              board={board}
              detail={boardDetails[board.id]}
              onView={() => setViewingBoardId(board.id)}
              onDelete={() => setDeleteTarget(board)}
              isDeleting={pendingBoardId === board.id}
            />
          ))}
        </div>
      )}

      <BoardDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={handleCreated} />
      <AdminBoardDetailDialog boardId={viewingBoardId} onClose={() => setViewingBoardId(null)} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete project"
        message={`Delete "${deleteTarget?.title}"? This removes all its columns and tasks.`}
        loading={pendingBoardId === deleteTarget?.id}
        onConfirm={() => deleteTarget && handleDeleteBoard(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
