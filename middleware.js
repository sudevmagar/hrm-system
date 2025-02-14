import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow access to the login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  if (pathname.startsWith("/dashboard") && token.role !== "HR") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard/manager-dashboard") && token.role !== "MANAGER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard/employee-dashboard") && token.role !== "EMPLOYEE") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/manager-dashboard/:path*",
    "/dashboard/employee-dashboard/:path*",
  ],
};