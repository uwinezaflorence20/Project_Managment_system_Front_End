"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Board } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { BoardDialog } from "@/components/BoardDialog";

export function EmptyDashboard() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleCreated(board: Board) {
    router.push(`/boards/${board.id}`);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No projects yet</p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Create your first project to start organizing tasks into columns.
      </p>
      <Button onClick={() => setIsDialogOpen(true)}>Create a project</Button>
      <BoardDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={handleCreated} />
    </div>
  );
}
