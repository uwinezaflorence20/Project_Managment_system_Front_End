"use client";

import { useState, type KeyboardEvent } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BoardColumn, Task } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";

interface ColumnProps {
  column: BoardColumn;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function Column({ column, onAddTask, onTaskClick, onRename, onDelete }: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: "Column" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskIds = column.tasks.map((t) => t.id);

  function commitTitle() {
    const trimmed = titleDraft.trim();
    setIsEditingTitle(false);
    if (trimmed && trimmed !== column.title) {
      onRename(trimmed);
    } else {
      setTitleDraft(column.title);
    }
  }

  function onTitleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitTitle();
    if (e.key === "Escape") {
      setTitleDraft(column.title);
      setIsEditingTitle(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-slate-100 p-3 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2" {...attributes} {...listeners}>
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={onTitleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded border-0 bg-white px-1.5 py-0.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-indigo-300 focus:outline-none"
          />
        ) : (
          <h3
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            className="cursor-text truncate text-sm font-semibold text-slate-700"
            title="Click to rename"
          >
            {column.title}{" "}
            <span className="font-normal text-slate-400">({column.tasks.length})</span>
          </h3>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Delete ${column.title} column`}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[2rem] flex-col gap-2">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={onAddTask}
        className="flex items-center justify-center gap-1 rounded-md py-1.5 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-700"
      >
        + Add task
      </button>
    </div>
  );
}
