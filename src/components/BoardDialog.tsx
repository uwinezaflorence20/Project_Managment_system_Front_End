"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Board, User } from "@/lib/types";
import { boardSchema } from "@/lib/validation";
import { createBoard, updateBoard, adminListUsers, addBoardMember } from "@/lib/endpoints";
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
  const { user } = useAuth();
  const isEditing = Boolean(board);
  const [title, setTitle] = useState(board?.title ?? "");
  const [description, setDescription] = useState(board?.description ?? "");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(board?.title ?? "");
      setDescription(board?.description ?? "");
      setMemberIds([]);
      setFieldErrors({});
      setFormError(null);
    }
  }, [open, board]);

  useEffect(() => {
    if (!open || isEditing) return;
    adminListUsers()
      .then((users) => setAvailableUsers(users.filter((u) => u.id !== user?.id)))
      .catch(() => setAvailableUsers([]));
  }, [open, isEditing, user?.id]);

  function toggleMember(id: string, checked: boolean) {
    setMemberIds((prev) => (checked ? [...prev, id] : prev.filter((existing) => existing !== id)));
  }

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
      let saved = board
        ? await updateBoard(board.id, parsed.data)
        : await createBoard(parsed.data);

      if (!isEditing && memberIds.length > 0) {
        const failed: string[] = [];
        for (const id of memberIds) {
          const member = availableUsers.find((u) => u.id === id);
          if (!member) continue;
          try {
            saved = await addBoardMember(saved.id, member.email);
          } catch {
            failed.push(member.name);
          }
        }
        if (failed.length > 0) {
          alert(`Project created, but couldn't add: ${failed.join(", ")}. You can add them from the board's Members panel.`);
        }
      }

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
        {!isEditing && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Add members (optional)
            </label>
            <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto rounded-md bg-white px-2 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 dark:bg-white/5 dark:ring-white/10">
              {availableUsers.length === 0 ? (
                <p className="px-1 py-1 text-sm text-slate-400 dark:text-slate-500">
                  No other users yet.
                </p>
              ) : (
                availableUsers.map((candidate) => (
                  <label
                    key={candidate.id}
                    className="flex items-center gap-2 rounded px-1 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={memberIds.includes(candidate.id)}
                      onChange={(e) => toggleMember(candidate.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-indigo-600 dark:border-white/20 dark:accent-indigo-400"
                    />
                    <span>
                      {candidate.name}{" "}
                      <span className="text-slate-400 dark:text-slate-500">({candidate.email})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
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
