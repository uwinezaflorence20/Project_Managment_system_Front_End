"use client";

import { useState } from "react";
import Link from "next/link";
import type { Board } from "@/lib/types";
import { deleteBoard } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { BoardDialog } from "@/components/BoardDialog";

export function BoardsClient({ initialBoards }: { initialBoards: Board[] }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [boards, setBoards] = useState(initialBoards);
  const [dialogBoard, setDialogBoard] = useState<Board | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(board: Board) {
    if (!confirm(`Delete "${board.title}"? This removes all its columns and tasks.`)) return;
    setError(null);
    setDeletingId(board.id);
    const previous = boards;
    setBoards((b) => b.filter((x) => x.id !== board.id));
    try {
      await deleteBoard(board.id);
    } catch (err) {
      setBoards(previous);
      setError(err instanceof ApiError ? err.message : "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(board: Board) {
    setBoards((b) => {
      const exists = b.some((x) => x.id === board.id);
      return exists ? b.map((x) => (x.id === board.id ? board : x)) : [board, ...b];
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAdmin ? "Pick a project or create a new one." : "Projects you've been added to."}
          </p>
        </div>
        {isAdmin && <Button onClick={() => setDialogBoard(null)}>New project</Button>}
      </div>

      <ErrorBanner message={error} />

      {boards.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 py-24 text-center dark:border-white/10">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No projects yet</p>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? "Create your first project to start organizing tasks into columns."
              : "Ask an admin to add you to a project."}
          </p>
          {isAdmin && <Button onClick={() => setDialogBoard(null)}>Create a project</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <div
              key={board.id}
              className="group relative flex flex-col justify-between rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md dark:bg-[#121130] dark:ring-white/10 dark:hover:shadow-none"
            >
              <Link href={`/boards/${board.id}`} className="flex flex-1 flex-col gap-1">
                <h2 className="font-semibold text-slate-900 dark:text-white">{board.title}</h2>
                {board.description && (
                  <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{board.description}</p>
                )}
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
                  {typeof board.taskCount === "number" && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {board.taskCount} {board.taskCount === 1 ? "task" : "tasks"}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex items-center opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => setDialogBoard(board)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-200"
                      aria-label={`Edit ${board.title}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(board)}
                      disabled={deletingId === board.id}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      aria-label={`Delete ${board.title}`}
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BoardDialog
        open={dialogBoard !== undefined}
        board={dialogBoard}
        onClose={() => setDialogBoard(undefined)}
        onSaved={handleSaved}
      />
    </div>
  );
}
