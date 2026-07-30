import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { DashboardStats } from "@/lib/types";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  let stats: DashboardStats;
  try {
    stats = await apiFetchServer<DashboardStats>("/dashboard");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return <DashboardClient initialStats={stats} />;
}
