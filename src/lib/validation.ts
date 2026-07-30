import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const boardSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  description: z.string().trim().max(500).optional(),
});

export const columnSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(60),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  description: z.string().trim().max(1000).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BoardInput = z.infer<typeof boardSchema>;
export type ColumnInput = z.infer<typeof columnSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
