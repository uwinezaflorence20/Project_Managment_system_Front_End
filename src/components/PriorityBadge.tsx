import type { TaskPriority } from "@/lib/types";

const STYLES: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  high: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-300",
};

const LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[priority]}`}>
      {LABELS[priority]}
    </span>
  );
}
