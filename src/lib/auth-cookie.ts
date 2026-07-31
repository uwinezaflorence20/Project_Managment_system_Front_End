export const TOKEN_COOKIE = "pm_token";
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day, matches backend JWT_EXPIRES_IN default
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days, when "Remember me" is checked

export function setTokenCookie(token: string, remember = false) {
  if (typeof document === "undefined") return;
  const maxAge = remember ? REMEMBER_MAX_AGE_SECONDS : MAX_AGE_SECONDS;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function getTokenCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}
