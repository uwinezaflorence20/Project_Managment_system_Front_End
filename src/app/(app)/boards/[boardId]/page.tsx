import { notFound, redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { Board } from "@/lib/types";
import { KanbanBoard } from "@/components/KanbanBoard";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;

  let board: Board;
  try {
    board = await apiFetchServer<Board>(`/boards/${boardId}`);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/login");
      if (err.status === 404) notFound();
    }
    throw err;
  }

  return <KanbanBoard board={board} />;
}
