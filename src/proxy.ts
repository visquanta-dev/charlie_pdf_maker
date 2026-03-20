import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  const isLoginPage = request.nextUrl.pathname === "/";

  if (isAuthRoute || isLoginPage) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("visquanta-audit-auth");
    if (authCookie?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
