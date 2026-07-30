"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Board, BoardColumn, Task, TaskPriority } from "@/lib/types";
import {
  createColumn,
  createTask,
  deleteColumn,
  deleteTask,
  moveTask,
  reorderColumns,
  updateColumn,
  updateTask,
} from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Column } from "@/components/Column";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface TaskDialogState {
  open: boolean;
  columnId: string | null;
  task: Task | null;
}

function findColumnByTaskId(columns: BoardColumn[], taskId: string) {
  return columns.find((c) => c.tasks.some((t) => t.id === taskId));
}

function findColumnById(columns: BoardColumn[], columnId: string) {
  return columns.find((c) => c.id === columnId);
}

export function KanbanBoard({ board }: { board: Board }) {
  const [columns, setColumns] = useState<BoardColumn[]>(board.columns ?? []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isSavingColumn, setIsSavingColumn] = useState(false);
  const [taskDialog, setTaskDialog] = useState<TaskDialogState>({
    open: false,
    columnId: null,
    task: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "Task") setActiveTaskId(active.id as string);
    if (active.data.current?.type === "Column") setActiveColumnId(active.id as string);
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);
    setActiveColumnId(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === "Column") {
      await handleColumnDrop(active.id as string, over.id as string);
      return;
    }
    if (active.data.current?.type === "Task") {
      await handleTaskDrop(active.id as string, over);
    }
  }

  async function handleColumnDrop(activeId: string, overId: string) {
    if (activeId === overId) return;
    const oldIndex = columns.findIndex((c) => c.id === activeId);
    const newIndex = columns.findIndex((c) => c.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = columns;
    const reordered = arrayMove(columns, oldIndex, newIndex);
    setColumns(reordered);
    setError(null);
    try {
      await reorderColumns(board.id, reordered.map((c) => c.id));
    } catch (err) {
      setColumns(previous);
      setError(err instanceof ApiError ? err.message : "Failed to reorder columns.");
    }
  }

  async function handleTaskDrop(activeTaskId: string, over: NonNullable<DragEndEvent["over"]>) {
    const sourceColumn = findColumnByTaskId(columns, activeTaskId);
    if (!sourceColumn) return;

    let destColumnId: string;
    if (over.data.current?.type === "Task") {
      destColumnId = over.data.current.columnId as string;
    } else if (over.data.current?.type === "Column") {
      destColumnId = over.id as string;
    } else {
      return;
    }
    const destColumn = findColumnById(columns, destColumnId);
    if (!destColumn) return;

    const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === activeTaskId);
    const destIndex =
      over.data.current?.type === "Task"
        ? destColumn.tasks.findIndex((t) => t.id === over.id)
        : destColumn.tasks.length;

    if (sourceColumn.id === destColumn.id && oldIndex === destIndex) return;

    const previous = columns;
    const next = columns.map((c) => ({ ...c, tasks: [...c.tasks] }));
    const srcCol = next.find((c) => c.id === sourceColumn.id)!;
    const dstCol = next.find((c) => c.id === destColumn.id)!;

    let finalIndex = destIndex;
    if (srcCol.id === dstCol.id) {
      srcCol.tasks = arrayMove(srcCol.tasks, oldIndex, destIndex);
    } else {
      const [movedTask] = srcCol.tasks.splice(oldIndex, 1);
      finalIndex = Math.min(destIndex, dstCol.tasks.length);
      dstCol.tasks.splice(finalIndex, 0, { ...movedTask, columnId: dstCol.id });
    }

    setColumns(next);
    setError(null);
    try {
      await moveTask(activeTaskId, dstCol.id, finalIndex);
    } catch (err) {
      setColumns(previous);
      setError(err instanceof ApiError ? err.message : "Failed to move task.");
    }
  }

  async function handleCreateColumn() {
    const title = newColumnTitle.trim();
    if (!title) {
      setIsAddingColumn(false);
      return;
    }
    setIsSavingColumn(true);
    setError(null);
    try {
      const column = await createColumn(board.id, { title });
      setColumns((prev) => [...prev, { ...column, tasks: [] }]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create column.");
    } finally {
      setIsSavingColumn(false);
    }
  }

  async function handleRenameColumn(columnId: string, title: string) {
    const previous = columns;
    setColumns((prev) => prev.map((c) => (c.id === columnId ? { ...c, title } : c)));
    try {
      await updateColumn(board.id, columnId, { title });
    } catch (err) {
      setColumns(previous);
      setError(err instanceof ApiError ? err.message : "Failed to rename column.");
    }
  }

  async function handleDeleteColumn(columnId: string) {
    const column = columns.find((c) => c.id === columnId);
    if (!column) return;
    if (!confirm(`Delete "${column.title}"? Its tasks will be deleted too.`)) return;
    const previous = columns;
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    try {
      await deleteColumn(board.id, columnId);
    } catch (err) {
      setColumns(previous);
      setError(err instanceof ApiError ? err.message : "Failed to delete column.");
    }
  }

  async function handleTaskSubmit(input: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
  }) {
    if (taskDialog.task) {
      const updated = await updateTask(taskDialog.task.id, input);
      setColumns((prev) =>
        prev.map((c) => ({
          ...c,
          tasks: c.tasks.map((t) => (t.id === updated.id ? updated : t)),
        })),
      );
    } else if (taskDialog.columnId) {
      const created = await createTask(board.id, taskDialog.columnId, input);
      setColumns((prev) =>
        prev.map((c) => (c.id === taskDialog.columnId ? { ...c, tasks: [...c.tasks, created] } : c)),
      );
    }
  }

  async function handleTaskDelete() {
    if (!taskDialog.task) return;
    await deleteTask(taskDialog.task.id);
    setColumns((prev) =>
      prev.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== taskDialog.task!.id) })),
    );
  }

  const activeTask = activeTaskId
    ? columns.flatMap((c) => c.tasks).find((t) => t.id === activeTaskId)
    : null;
  const activeColumn = activeColumnId ? columns.find((c) => c.id === activeColumnId) : null;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href="/boards" className="w-fit text-sm text-slate-500 hover:text-slate-700">
          ← Back to boards
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{board.title}</h1>
        {board.description && <p className="text-sm text-slate-500">{board.description}</p>}
      </div>

      <ErrorBanner message={error} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-1 items-start gap-4 overflow-x-auto pb-4">
          <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={() => setTaskDialog({ open: true, columnId: column.id, task: null })}
                onTaskClick={(task) => setTaskDialog({ open: true, columnId: column.id, task })}
                onRename={(title) => handleRenameColumn(column.id, title)}
                onDelete={() => handleDeleteColumn(column.id)}
              />
            ))}
          </SortableContext>

          <div className="w-72 shrink-0">
            {isAddingColumn ? (
              <div className="flex flex-col gap-2 rounded-lg bg-slate-100 p-3">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateColumn();
                    if (e.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }
                  }}
                  placeholder="Column title"
                  className="rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateColumn}
                    disabled={isSavingColumn}
                    className="rounded-md bg-indigo-600 px-2.5 py-1 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }}
                    className="rounded-md px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="w-full rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              >
                + Add column
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onClick={() => {}} dragOverlay />}
          {activeColumn && (
            <div className="w-72 rounded-lg bg-slate-200 p-3 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-700">{activeColumn.title}</h3>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={taskDialog.open}
        task={taskDialog.task}
        onClose={() => setTaskDialog({ open: false, columnId: null, task: null })}
        onSubmit={handleTaskSubmit}
        onDelete={taskDialog.task ? handleTaskDelete : undefined}
      />
    </div>
  );
}
