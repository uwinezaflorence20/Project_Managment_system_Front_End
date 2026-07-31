import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Board not found</p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        It may have been deleted, or it belongs to a different account.
      </p>
      <Link
        href="/boards"
        className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Back to boards
      </Link>
    </div>
  );
}
