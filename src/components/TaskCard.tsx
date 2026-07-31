"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/types";
import { PriorityBadge } from "@/components/PriorityBadge";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  dragOverlay?: boolean;
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TaskCard({ task, onClick, dragOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", columnId: task.columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignees = task.assignees ?? [];

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={dragOverlay ? undefined : style}
      {...(dragOverlay ? {} : attributes)}
      {...(dragOverlay ? {} : listeners)}
      onClick={onClick}
      className={`flex cursor-pointer flex-col gap-2 rounded-md bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300 dark:bg-[#141329] dark:ring-white/10 dark:hover:ring-white/20 ${
        isDragging ? "opacity-40" : ""
      } ${dragOverlay ? "rotate-2 shadow-lg" : ""}`}
    >
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
      {task.description && (
        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {assignees.length > 0 && (
            <div className="flex -space-x-1.5">
              {assignees.slice(0, 3).map((assignee) => (
                <span
                  key={assignee.id}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700 ring-2 ring-white dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-[#141329]"
                  title={assignee.user.name}
                >
                  {initialsFor(assignee.user.name)}
                </span>
              ))}
              {assignees.length > 3 && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[9px] font-semibold text-slate-600 ring-2 ring-white dark:bg-white/10 dark:text-slate-300 dark:ring-[#141329]"
                  title={assignees
                    .slice(3)
                    .map((a) => a.user.name)
                    .join(", ")}
                >
                  +{assignees.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        {task.dueDate && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}
