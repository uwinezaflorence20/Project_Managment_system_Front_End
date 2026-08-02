import { apiFetch } from "./api";
import type {
  AdminBoardDetail,
  AdminBoardSummary,
  AdminStats,
  Board,
  BoardColumn,
  Notification,
  Task,
  User,
  UserRole,
} from "./types";

export function listBoards() {
  return apiFetch<Board[]>("/boards");
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

export function addBoardMember(boardId: string, email: string) {
  return apiFetch<Board>(`/boards/${boardId}/members`, { method: "POST", body: { email } });
}

export function removeBoardMember(boardId: string, userId: string) {
  return apiFetch<Board>(`/boards/${boardId}/members/${userId}`, { method: "DELETE" });
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
  input: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assigneeIds?: string[];
  },
) {
  return apiFetch<Task>(`/boards/${boardId}/columns/${columnId}/tasks`, {
    method: "POST",
    body: input,
  });
}

export function updateTask(
  taskId: string,
  input: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assigneeIds?: string[];
  },
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

export function updateProfile(input: { name: string; email: string }) {
  return apiFetch<User>("/users/profile", { method: "PATCH", body: input });
}

export function changePassword(input: { currentPassword: string; newPassword: string }) {
  return apiFetch<void>("/users/change-password", { method: "PATCH", body: input });
}

export function adminGetStats() {
  return apiFetch<AdminStats>("/admin/stats");
}

export function adminListUsers() {
  return apiFetch<User[]>("/admin/users");
}

export function adminUpdateUserRole(userId: string, role: UserRole) {
  return apiFetch<User>(`/admin/users/${userId}/role`, { method: "PATCH", body: { role } });
}

export function adminDeleteUser(userId: string) {
  return apiFetch<void>(`/admin/users/${userId}`, { method: "DELETE" });
}

export function adminListBoards() {
  return apiFetch<AdminBoardSummary[]>("/admin/boards");
}

export function adminGetBoardDetail(boardId: string) {
  return apiFetch<AdminBoardDetail>(`/admin/boards/${boardId}`);
}

export function adminDeleteBoard(boardId: string) {
  return apiFetch<void>(`/admin/boards/${boardId}`, { method: "DELETE" });
}

export function listNotifications() {
  return apiFetch<Notification[]>("/notifications");
}

export function markNotificationRead(notificationId: string) {
  return apiFetch<Notification>(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return apiFetch<void>("/notifications/read-all", { method: "PATCH" });
}
