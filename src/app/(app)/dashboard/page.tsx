import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { Board } from "@/lib/types";
import { EmptyDashboard } from "./EmptyDashboard";

export default async function DashboardPage() {
  let boards: Board[];
  try {
    boards = await apiFetchServer<Board[]>("/boards");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (boards.length === 0) {
    return <EmptyDashboard />;
  }

  const mostRecent = [...boards].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];

  redirect(`/boards/${mostRecent.id}`);
}
