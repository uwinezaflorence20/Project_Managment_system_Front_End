import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "./lib/auth-cookie";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  const isProtectedRoute =
    pathname.startsWith("/boards") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/team");

  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/boards/:path*", "/dashboard/:path*", "/settings/:path*", "/users/:path*", "/team/:path*"],
};
