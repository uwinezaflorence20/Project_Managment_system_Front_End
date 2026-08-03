"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import type { Board } from "@/lib/types";
import { boardSchema, addMemberSchema } from "@/lib/validation";
import { createBoard, updateBoard, addBoardMember } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";

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
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(board?.title ?? "");
      setDescription(board?.description ?? "");
      setMemberEmails([]);
      setEmailInput("");
      setEmailError(undefined);
      setFieldErrors({});
    }
  }, [open, board]);

  function addEmail() {
    const parsed = addMemberSchema.safeParse({ email: emailInput });
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message);
      return;
    }
    const email = parsed.data.email;
    if (email === user?.email) {
      setEmailError("You're already the owner.");
      return;
    }
    if (memberEmails.includes(email)) {
      setEmailError("Already added.");
      return;
    }
    setMemberEmails((prev) => [...prev, email]);
    setEmailInput("");
    setEmailError(undefined);
  }

  function removeEmail(email: string) {
    setMemberEmails((prev) => prev.filter((e) => e !== email));
  }

  function onEmailKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  }

  function reset() {
    setFieldErrors({});
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
    setIsSubmitting(true);
    try {
      let saved = board
        ? await updateBoard(board.id, parsed.data)
        : await createBoard(parsed.data);

      if (!isEditing && memberEmails.length > 0) {
        const failed: string[] = [];
        for (const email of memberEmails) {
          try {
            saved = await addBoardMember(saved.id, email);
          } catch {
            failed.push(email);
          }
        }
        if (failed.length > 0) {
          toast.error(
            `Project created, but couldn't add: ${failed.join(", ")}. You can add them from the board's Members panel.`,
          );
        }
      }

      onSaved(saved);
      toast.success(isEditing ? "Project updated." : "Project created.");
      reset();
      onClose();
    } catch (err) {
      toast.error(
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
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  id="board-member-email"
                  type="email"
                  placeholder="teammate@example.com"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError(undefined);
                  }}
                  onKeyDown={onEmailKeyDown}
                  error={emailError}
                />
              </div>
              <Button type="button" variant="secondary" onClick={addEmail}>
                Add
              </Button>
            </div>
            {memberEmails.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {memberEmails.map((email) => (
                  <span
                    key={email}
                    className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      aria-label={`Remove ${email}`}
                      className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
