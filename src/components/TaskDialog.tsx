"use client";

import { useState, type FormEvent } from "react";
import type { Task, TaskPriority } from "@/lib/types";
import { taskSchema } from "@/lib/validation";
import { ApiError } from "@/lib/api-error";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  assigneeOptions: { id: string; name: string }[];
  onSubmit: (input: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
    assigneeIds?: string[];
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function TaskDialog({ open, onClose, task, assigneeOptions, onSubmit, onDelete }: TaskDialogProps) {
  const isEditing = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    task?.assignees?.map((a) => a.userId) ?? [],
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function resetToTask() {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : "");
    setAssigneeIds(task?.assignees?.map((a) => a.userId) ?? []);
    setFieldErrors({});
    setFormError(null);
  }

  function toggleAssignee(id: string, checked: boolean) {
    setAssigneeIds((prev) => (checked ? [...prev, id] : prev.filter((existing) => existing !== id)));
  }

  function handleClose() {
    resetToTask();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = taskSchema.safeParse({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
      assigneeIds,
    });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      handleClose();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!confirm("Delete this task?")) return;
    setIsDeleting(true);
    try {
      await onDelete();
      handleClose();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditing ? "Edit task" : "Add task"}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <ErrorBanner message={formError} />
        <Input
          id="task-title"
          label="Title"
          placeholder="Design the login page"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title}
          autoFocus
        />
        <TextArea
          id="task-description"
          label="Description (optional)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={fieldErrors.description}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="task-priority"
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input
            id="task-due-date"
            type="date"
            label="Deadline (optional)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assignees</label>
          <div className="flex max-h-32 flex-col gap-0.5 overflow-y-auto rounded-md bg-white px-2 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 dark:bg-white/5 dark:ring-white/10">
            {assigneeOptions.length === 0 ? (
              <p className="px-1 py-1 text-sm text-slate-400 dark:text-slate-500">
                No project members yet.
              </p>
            ) : (
              assigneeOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 rounded px-1 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <input
                    type="checkbox"
                    checked={assigneeIds.includes(option.id)}
                    onChange={(e) => toggleAssignee(option.id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600 dark:border-white/20 dark:accent-indigo-400"
                  />
                  {option.name}
                </label>
              ))
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          {isEditing && onDelete ? (
            <Button type="button" variant="danger" loading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? "Save changes" : "Publish"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
