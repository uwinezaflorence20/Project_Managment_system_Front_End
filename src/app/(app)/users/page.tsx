import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { User } from "@/lib/types";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
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

  const users = await apiFetchServer<User[]>("/admin/users");

  return <UsersClient currentUserId={currentUser.id} initialUsers={users} />;
}
