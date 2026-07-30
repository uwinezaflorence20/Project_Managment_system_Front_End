import "server-only";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "./auth-cookie";
import { apiFetch } from "./api";

export async function apiFetchServer<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  return apiFetch<T>(path, { ...options, token });
}

export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}
