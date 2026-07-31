"use client";

import { useState } from "react";
import type { AdminBoardSummary, AdminStats, User, UserRole } from "@/lib/types";
import { adminDeleteBoard, adminDeleteUser, adminUpdateUserRole } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Select } from "@/components/ui/Select";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export function AdminClient({
  currentUserId,
  initialStats,
  initialUsers,
  initialBoards,
}: {
  currentUserId: string;
  initialStats: AdminStats;
  initialUsers: User[];
  initialBoards: AdminBoardSummary[];
}) {
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState(initialUsers);
  const [boards, setBoards] = useState(initialBoards);
  const [error, setError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingBoardId, setPendingBoardId] = useState<string | null>(null);

  async function handleRoleChange(user: User, role: UserRole) {
    if (role === user.role) return;
    setError(null);
    setPendingUserId(user.id);
    const previous = users;
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role } : u)));
    try {
      const updated = await adminUpdateUserRole(user.id, role);
      setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      setStats((s) => ({
        ...s,
        totalAdmins: s.totalAdmins + (role === "admin" ? 1 : -1),
      }));
    } catch (err) {
      setUsers(previous);
      setError(err instanceof ApiError ? err.message : "Failed to update role.");
    } finally {
      setPendingUserId(null);
    }
  }

  async function handleDeleteUser(user: User) {
    if (!confirm(`Delete "${user.name}"? This also deletes every board they own.`)) return;
    setError(null);
    setPendingUserId(user.id);
    const previousUsers = users;
    setUsers((list) => list.filter((u) => u.id !== user.id));
    try {
      await adminDeleteUser(user.id);
      setStats((s) => ({
        ...s,
        totalUsers: s.totalUsers - 1,
        totalAdmins: s.totalAdmins - (user.role === "admin" ? 1 : 0),
      }));
      setBoards((list) => list.filter((b) => b.ownerId !== user.id));
    } catch (err) {
      setUsers(previousUsers);
      setError(err instanceof ApiError ? err.message : "Failed to delete user.");
    } finally {
      setPendingUserId(null);
    }
  }

  async function handleDeleteBoard(board: AdminBoardSummary) {
    if (!confirm(`Delete "${board.title}"? This removes all its columns and tasks.`)) return;
    setError(null);
    setPendingBoardId(board.id);
    const previous = boards;
    setBoards((list) => list.filter((b) => b.id !== board.id));
    try {
      await adminDeleteBoard(board.id);
      setStats((s) => ({ ...s, totalBoards: s.totalBoards - 1, totalTasks: s.totalTasks - board.taskCount }));
    } catch (err) {
      setBoards(previous);
      setError(err instanceof ApiError ? err.message : "Failed to delete board.");
    } finally {
      setPendingBoardId(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage users and boards across the whole platform.
        </p>
      </div>

      <ErrorBanner message={error} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Admins" value={stats.totalAdmins} />
        <StatCard label="Boards" value={stats.totalBoards} />
        <StatCard label="Tasks" value={stats.totalTasks} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Users</h2>
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-white/10">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isPending = pendingUserId === user.id;
                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {user.name} {isSelf && <span className="text-slate-400 dark:text-slate-500">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <Select
                        aria-label={`Role for ${user.name}`}
                        value={user.role}
                        disabled={isSelf || isPending}
                        onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                        className="py-1.5"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={isSelf || isPending}
                        className="text-sm font-medium text-red-600 hover:text-red-500 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-red-400 dark:disabled:text-slate-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Boards</h2>
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-white/10">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {boards.map((board) => (
                <tr key={board.id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{board.title}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {board.ownerName} <span className="text-slate-400 dark:text-slate-500">({board.ownerEmail})</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{board.taskCount}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(board.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteBoard(board)}
                      disabled={pendingBoardId === board.id}
                      className="text-sm font-medium text-red-600 hover:text-red-500 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-red-400 dark:disabled:text-slate-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
