"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Something went wrong loading your team.
      </p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
