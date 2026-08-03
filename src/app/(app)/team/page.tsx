import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";
import { ApiError } from "@/lib/api-error";
import type { Board, User } from "@/lib/types";

interface Person {
  user: User;
  boardTitles: string[];
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function TeamPage() {
  let currentUser: User;
  let boards: Board[];
  try {
    currentUser = await apiFetchServer<User>("/auth/me");
    boards = await apiFetchServer<Board[]>("/boards");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  const byId = new Map<string, Person>();
  for (const board of boards) {
    const collaborators = [
      ...(board.owner ? [board.owner] : []),
      ...(board.members?.map((m) => m.user) ?? []),
    ];
    for (const person of collaborators) {
      const existing = byId.get(person.id);
      if (existing) {
        if (!existing.boardTitles.includes(board.title)) existing.boardTitles.push(board.title);
      } else {
        byId.set(person.id, { user: person, boardTitles: [board.title] });
      }
    }
  }

  const people = Array.from(byId.values()).sort((a, b) => a.user.name.localeCompare(b.user.name));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Everyone you share a project with.</p>
      </div>

      {people.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 py-24 text-center dark:border-white/10">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No teammates yet</p>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
            People show up here once you share a project with them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map(({ user, boardTitles }) => {
            const isYou = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    {initialsFor(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                      {user.name}{" "}
                      {isYou && <span className="font-normal text-slate-400 dark:text-slate-500">(you)</span>}
                    </p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  {user.role === "admin" && (
                    <span className="ml-auto shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {boardTitles.map((title) => (
                    <span
                      key={title}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
