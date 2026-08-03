import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { AdminBoardSummary, AdminStats, Board, User } from "@/lib/types";
import { EmptyDashboard } from "./EmptyDashboard";
import { AdminHomeClient } from "./AdminHomeClient";

export default async function DashboardPage() {
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
    const [stats, boards] = await Promise.all([
      apiFetchServer<AdminStats>("/admin/stats"),
      apiFetchServer<AdminBoardSummary[]>("/admin/boards"),
    ]);
    return <AdminHomeClient stats={stats} boards={boards} />;
  }

  const boards = await apiFetchServer<Board[]>("/boards");

  if (boards.length === 0) {
    return <EmptyDashboard />;
  }

  const mostRecent = [...boards].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];

  redirect(`/boards/${mostRecent.id}`);
}
