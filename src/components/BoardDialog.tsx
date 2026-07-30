"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Board } from "@/lib/types";
import { boardSchema } from "@/lib/validation";
import { createBoard, updateBoard } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface BoardDialogProps {
  open: boolean;
  board?: Board | null;
  onClose: () => void;
  onSaved: (board: Board) => void;
}

export function BoardDialog({ open, board, onClose, onSaved }: BoardDialogProps) {
  const isEditing = Boolean(board);
  const [title, setTitle] = useState(board?.title ?? "");
  const [description, setDescription] = useState(board?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(board?.title ?? "");
      setDescription(board?.description ?? "");
      setFieldErrors({});
      setFormError(null);
    }
  }, [open, board]);

  function reset() {
    setFieldErrors({});
    setFormError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = boardSchema.safeParse({ title, description: description || undefined });
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
      const saved = board
        ? await updateBoard(board.id, parsed.data)
        : await createBoard(parsed.data);
      onSaved(saved);
      reset();
      onClose();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : `Failed to ${isEditing ? "update" : "create"} project.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={isEditing ? "Edit project" : "Create a project"}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <ErrorBanner message={formError} />
        <Input
          id="board-title"
          label="Title"
          placeholder="Website Redesign"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title}
          autoFocus
        />
        <TextArea
          id="board-description"
          label="Description (optional)"
          placeholder="Everything needed to ship the new site"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={fieldErrors.description}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
