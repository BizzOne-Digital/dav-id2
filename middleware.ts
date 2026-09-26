import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/auth.config";
import { isAdminRole } from "@/lib/constants/roles";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url));
    }
    if (!isAdminRole(session.user.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/game")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/game/:path*"],
};
