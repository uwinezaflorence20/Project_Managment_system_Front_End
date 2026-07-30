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

export function TaskCard({ task, onClick, dragOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", columnId: task.columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={dragOverlay ? undefined : style}
      {...(dragOverlay ? {} : attributes)}
      {...(dragOverlay ? {} : listeners)}
      onClick={onClick}
      className={`flex cursor-pointer flex-col gap-2 rounded-md bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300 ${
        isDragging ? "opacity-40" : ""
      } ${dragOverlay ? "rotate-2 shadow-lg" : ""}`}
    >
      <p className="text-sm font-medium text-slate-800">{task.title}</p>
      {task.description && (
        <p className="line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-slate-400">
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}
