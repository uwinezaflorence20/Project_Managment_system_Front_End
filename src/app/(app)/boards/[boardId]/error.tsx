"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-slate-700">Something went wrong loading this board.</p>
      <p className="max-w-xs text-sm text-slate-500">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="secondary">
          Try again
        </Button>
        <Link
          href="/boards"
          className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Back to boards
        </Link>
      </div>
    </div>
  );
}
