"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";
import { clearTokenCookie, getTokenCookie, setTokenCookie } from "./auth-cookie";
import type { AuthResult, User } from "./types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiFetch<User>("/auth/me", { token })
      .then(setUser)
      .catch(() => {
        clearTokenCookie();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const applyAuthResult = useCallback((result: AuthResult) => {
    setTokenCookie(result.accessToken);
    setUser(result.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiFetch<AuthResult>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      applyAuthResult(result);
    },
    [applyAuthResult],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await apiFetch<AuthResult>("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      applyAuthResult(result);
    },
    [applyAuthResult],
  );

  const logout = useCallback(() => {
    clearTokenCookie();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
