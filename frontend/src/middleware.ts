// middleware.ts
import { NextRequest, NextResponse } from "next/server";

async function validateAuth(request: NextRequest) {
  try {
    const cookies = request.cookies.toString();
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:7001/api";

    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Cookie: cookies,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Auth validation error:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for auth pages
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Validate authentication
  const authData = await validateAuth(request);

  if (!authData) {
    // Not authenticated - redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Authenticated - pass auth data to pages and let them handle routing
  const response = NextResponse.next();
  response.headers.set("x-user-data", JSON.stringify(authData));

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|auth/login|auth/register).*)",
  ],
};
