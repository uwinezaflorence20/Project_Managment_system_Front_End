import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { Board } from "@/lib/types";
import { BoardsClient } from "./BoardsClient";

export default async function BoardsPage() {
  let boards: Board[];
  try {
    boards = await apiFetchServer<Board[]>("/boards");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return <BoardsClient initialBoards={boards} />;
}
