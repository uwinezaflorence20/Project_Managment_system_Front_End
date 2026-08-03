"use client";

import { useState } from "react";
import type { User, UserRole } from "@/lib/types";
import { adminDeleteUser, adminUpdateUserRole } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Select } from "@/components/ui/Select";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function UsersClient({
  currentUserId,
  initialUsers,
}: {
  currentUserId: string;
  initialUsers: User[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  async function handleRoleChange(user: User, role: UserRole) {
    if (role === user.role) return;
    setError(null);
    setPendingUserId(user.id);
    const previous = users;
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role } : u)));
    try {
      const updated = await adminUpdateUserRole(user.id, role);
      setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setUsers(previous);
      setError(err instanceof ApiError ? err.message : "Failed to update role.");
    } finally {
      setPendingUserId(null);
    }
  }

  async function handleDeleteUser(user: User) {
    setError(null);
    setPendingUserId(user.id);
    const previous = users;
    setUsers((list) => list.filter((u) => u.id !== user.id));
    try {
      await adminDeleteUser(user.id);
    } catch (err) {
      setUsers(previous);
      setError(err instanceof ApiError ? err.message : "Failed to delete user.");
    } finally {
      setPendingUserId(null);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage every account on the platform — role and access.
        </p>
      </div>

      <ErrorBanner message={error} />

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
                      onClick={() => setDeleteTarget(user)}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete user"
        message={`Delete "${deleteTarget?.name}"? This also deletes every board they own.`}
        loading={pendingUserId === deleteTarget?.id}
        onConfirm={() => deleteTarget && handleDeleteUser(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
