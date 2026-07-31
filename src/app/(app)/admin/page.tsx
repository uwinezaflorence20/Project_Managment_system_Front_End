import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { AdminBoardSummary, AdminStats, User } from "@/lib/types";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
  let currentUser: User;
  try {
    currentUser = await apiFetchServer<User>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (currentUser.role !== "admin") {
    redirect("/dashboard");
  }

  const [stats, users, boards] = await Promise.all([
    apiFetchServer<AdminStats>("/admin/stats"),
    apiFetchServer<User[]>("/admin/users"),
    apiFetchServer<AdminBoardSummary[]>("/admin/boards"),
  ]);

  return (
    <AdminClient
      currentUserId={currentUser.id}
      initialStats={stats}
      initialUsers={users}
      initialBoards={boards}
    />
  );
}
