"use client";

import { useState, type FormEvent } from "react";
import type { Board, BoardMember } from "@/lib/types";
import { addMemberSchema } from "@/lib/validation";
import { addBoardMember, removeBoardMember } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface BoardMembersDialogProps {
  open: boolean;
  onClose: () => void;
  board: Board;
  members: BoardMember[];
  onMembersChange: (members: BoardMember[]) => void;
}

export function BoardMembersDialog({
  open,
  onClose,
  board,
  members,
  onMembersChange,
}: BoardMembersDialogProps) {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  function handleClose() {
    setEmail("");
    setFieldError(undefined);
    setFormError(null);
    onClose();
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const parsed = addMemberSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    setFormError(null);
    setIsAdding(true);
    try {
      const updated = await addBoardMember(board.id, parsed.data.email);
      onMembersChange(updated.members ?? []);
      setEmail("");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to add member.");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemove(member: BoardMember) {
    if (!confirm(`Remove ${member.user.name} from this project?`)) return;
    setRemovingId(member.id);
    setFormError(null);
    try {
      const updated = await removeBoardMember(board.id, member.userId);
      onMembersChange(updated.members ?? []);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to remove member.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Project members">
      <div className="flex flex-col gap-4">
        <ErrorBanner message={formError} />
        <form onSubmit={handleAdd} className="flex items-end gap-2" noValidate>
          <div className="flex-1">
            <Input
              id="member-email"
              label="Add by email"
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldError}
            />
          </div>
          <Button type="submit" loading={isAdding}>
            Add
          </Button>
        </form>

        <div className="flex flex-col gap-1">
          {board.owner && (
            <div className="flex items-center justify-between rounded-md px-2 py-2">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{board.owner.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{board.owner.email}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Owner</span>
            </div>
          )}
          {members.length === 0 ? (
            <p className="px-2 py-3 text-sm text-slate-500 dark:text-slate-400">No other members yet.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{member.user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{member.user.email}</p>
                </div>
                <button
                  onClick={() => handleRemove(member)}
                  disabled={removingId === member.id}
                  className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
