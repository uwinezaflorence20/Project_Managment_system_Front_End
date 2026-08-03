"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { AdminBoardDetail } from "@/lib/types";
import { adminGetBoardDetail } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";

export function AdminBoardDetailDialog({
  boardId,
  onClose,
}: {
  boardId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<AdminBoardDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!boardId) {
      setDetail(null);
      return;
    }
    setIsLoading(true);
    adminGetBoardDetail(boardId)
      .then(setDetail)
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to load project details."),
      )
      .finally(() => setIsLoading(false));
  }, [boardId]);

  return (
    <Modal open={boardId !== null} onClose={onClose} title={detail?.title ?? "Project details"}>
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5 text-slate-400" />
          </div>
        )}

        {detail && !isLoading && (
          <>
            {detail.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{detail.description}</p>
            )}

            <div className="flex flex-col gap-1.5 rounded-md bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">Overall progress</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {detail.completedTaskCount}/{detail.taskCount} tasks · {detail.progressPercent}%
                </span>
              </div>
              <ProgressBar percent={detail.progressPercent} />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {detail.columnCount} {detail.columnCount === 1 ? "column" : "columns"} · owned by{" "}
                {detail.ownerName} ({detail.ownerEmail})
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                People on this project
              </h3>
              <div className="flex max-h-64 flex-col gap-3 overflow-y-auto">
                {detail.memberProgress.map((member) => (
                  <div key={member.userId} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {member.name}
                        {member.isOwner && (
                          <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                            (owner)
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {member.completedCount}/{member.assignedCount} · {member.progressPercent}%
                      </span>
                    </div>
                    <ProgressBar percent={member.progressPercent} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
