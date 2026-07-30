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
  onSubmit: (input: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function TaskDialog({ open, onClose, task, onSubmit, onDelete }: TaskDialogProps) {
  const isEditing = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function resetToTask() {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : "");
    setFieldErrors({});
    setFormError(null);
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
    <Modal open={open} onClose={handleClose} title={isEditing ? "Edit task" : "New task"}>
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
            label="Due date (optional)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
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
              {isEditing ? "Save changes" : "Add task"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
