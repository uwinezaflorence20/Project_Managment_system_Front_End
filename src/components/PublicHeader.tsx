import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-slate-900">
          FlowBoard
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
