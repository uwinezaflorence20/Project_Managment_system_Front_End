import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { AdminBoardSummary, Board, User } from "@/lib/types";
import { BoardsClient } from "./BoardsClient";
import { AdminBoardsClient } from "./AdminBoardsClient";

export default async function BoardsPage() {
  let currentUser: User;
  try {
    currentUser = await apiFetchServer<User>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (currentUser.role === "admin") {
    const boards = await apiFetchServer<AdminBoardSummary[]>("/admin/boards");
    return <AdminBoardsClient initialBoards={boards} />;
  }

  const boards = await apiFetchServer<Board[]>("/boards");
  return <BoardsClient initialBoards={boards} />;
}
