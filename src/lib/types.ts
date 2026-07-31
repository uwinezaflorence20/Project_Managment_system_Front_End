export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}

export interface TaskAssignee {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  order: number;
  columnId: string;
  boardId: string;
  dueDate?: string | null;
  assignees?: TaskAssignee[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  owner?: User;
  columns?: BoardColumn[];
  members?: BoardMember[];
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBoards: number;
  totalTasks: number;
}

export interface AdminBoardSummary {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | "task_assigned"
  | "board_added"
  | "task_due_soon"
  | "task_overdue";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  boardId?: string | null;
  taskId?: string | null;
  isRead: boolean;
  createdAt: string;
}
