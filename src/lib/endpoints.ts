import { apiFetch } from "./api";
import type { Board, BoardColumn, DashboardStats, Task } from "./types";

export function listBoards() {
  return apiFetch<Board[]>("/boards");
}

export function getDashboard() {
  return apiFetch<DashboardStats>("/dashboard");
}

export function getBoard(boardId: string) {
  return apiFetch<Board>(`/boards/${boardId}`);
}

export function createBoard(input: { title: string; description?: string }) {
  return apiFetch<Board>("/boards", { method: "POST", body: input });
}

export function updateBoard(boardId: string, input: { title?: string; description?: string }) {
  return apiFetch<Board>(`/boards/${boardId}`, { method: "PATCH", body: input });
}

export function deleteBoard(boardId: string) {
  return apiFetch<void>(`/boards/${boardId}`, { method: "DELETE" });
}

export function createColumn(boardId: string, input: { title: string }) {
  return apiFetch<BoardColumn>(`/boards/${boardId}/columns`, { method: "POST", body: input });
}

export function updateColumn(boardId: string, columnId: string, input: { title: string }) {
  return apiFetch<BoardColumn>(`/boards/${boardId}/columns/${columnId}`, {
    method: "PATCH",
    body: input,
  });
}

export function reorderColumns(boardId: string, orderedColumnIds: string[]) {
  return apiFetch<BoardColumn[]>(`/boards/${boardId}/columns/reorder`, {
    method: "PATCH",
    body: { orderedColumnIds },
  });
}

export function deleteColumn(boardId: string, columnId: string) {
  return apiFetch<void>(`/boards/${boardId}/columns/${columnId}`, { method: "DELETE" });
}

export function createTask(
  boardId: string,
  columnId: string,
  input: { title: string; description?: string; priority?: string; dueDate?: string },
) {
  return apiFetch<Task>(`/boards/${boardId}/columns/${columnId}/tasks`, {
    method: "POST",
    body: input,
  });
}

export function updateTask(
  taskId: string,
  input: { title?: string; description?: string; priority?: string; dueDate?: string },
) {
  return apiFetch<Task>(`/tasks/${taskId}`, { method: "PATCH", body: input });
}

export function moveTask(taskId: string, targetColumnId: string, targetIndex: number) {
  return apiFetch<Task>(`/tasks/${taskId}/move`, {
    method: "PATCH",
    body: { targetColumnId, targetIndex },
  });
}

export function deleteTask(taskId: string) {
  return apiFetch<void>(`/tasks/${taskId}`, { method: "DELETE" });
}
