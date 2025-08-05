// middleware.ts (in root directory)
import { NextRequest, NextResponse } from "next/server";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Team {
  _id: string;
  name: string;
  slug: string;
  role: string;
}

interface Workspace {
  _id: string;
  name: string;
  slug: string;
}

interface Membership {
  workspace: Workspace;
  role: string;
  teams: Team[];
}

interface AuthResponse {
  user: User;
  memberships: Membership[];
}

async function validateAuth(
  request: NextRequest
): Promise<AuthResponse | null> {
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
    return null;
  }
}

function findTeamInMemberships(memberships: Membership[], teamSlug: string) {
  for (const membership of memberships) {
    const team = membership.teams.find((t) => t.slug === teamSlug);
    if (team) {
      return { workspace: membership.workspace, team, membership };
    }
  }
  return null;
}

function getLastValidUrl(request: NextRequest): string | null {
  return request.cookies.get("lastValidUrl")?.value || null;
}

function setLastValidUrl(response: NextResponse, url: string) {
  response.cookies.set("lastValidUrl", url, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

function getFallbackUrl(
  memberships: Membership[],
  lastValidUrl?: string
): string {
  if (lastValidUrl) {
    const urlParts = lastValidUrl.split("/");
    if (urlParts.length >= 4 && urlParts[2] === "team") {
      const workspaceSlug = urlParts[1];
      const teamSlug = urlParts[3];

      const membership = memberships.find(
        (m) => m.workspace.slug === workspaceSlug
      );
      const isStillValid = membership?.teams.some((t) => t.slug === teamSlug);

      if (isStillValid) {
        return lastValidUrl;
      }
    }
  }

  if (memberships.length > 0) {
    const first = memberships[0];
    if (first.teams.length > 0) {
      return `/${first.workspace.slug}/team/${first.teams[0].slug}`;
    }
  }

  return "/auth/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("hello");

  // Skip for API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow all auth routes without authentication check
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Validate authentication for all other routes
  const authData = await validateAuth(request);

  if (!authData) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { memberships } = authData;
  const lastValidUrl = getLastValidUrl(request);

  // Handle root path
  if (pathname === "/") {
    const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
    return NextResponse.redirect(new URL(fallbackUrl, request.url));
  }

  // Handle /team/TEAMSLUG (missing workspace)
  const teamOnlyMatch = pathname.match(/^\/team\/([^\/]+)$/);
  if (teamOnlyMatch) {
    const teamSlug = teamOnlyMatch[1];
    const found = findTeamInMemberships(memberships, teamSlug);

    if (found) {
      const correctUrl = `/${found.workspace.slug}/team/${found.team.slug}`;
      const response = NextResponse.redirect(new URL(correctUrl, request.url));
      setLastValidUrl(response, correctUrl);
      return response;
    } else {
      const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }
  }

  // Handle incomplete URLs
  if (pathname === "/team" || pathname === "/workspace") {
    const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
    return NextResponse.redirect(new URL(fallbackUrl, request.url));
  }

  // Handle workspace routes
  const workspaceMatch = pathname.match(/^\/([^\/]+)(?:\/(.*))?$/);
  if (workspaceMatch) {
    const workspaceSlug = workspaceMatch[1];
    const subPath = workspaceMatch[2] || "";

    const currentMembership = memberships.find(
      (m) => m.workspace.slug === workspaceSlug
    );

    if (!currentMembership) {
      const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }

    // Handle workspace home or /workspace/team
    if (!subPath || subPath === "team") {
      if (currentMembership.teams.length > 0) {
        const targetUrl = `/${workspaceSlug}/team/${currentMembership.teams[0].slug}`;
        const response = NextResponse.redirect(new URL(targetUrl, request.url));
        setLastValidUrl(response, targetUrl);
        return response;
      }
    }

    // Handle /workspace/team/teamslug
    const teamMatch = subPath.match(/^team\/([^\/]+)$/);
    if (teamMatch) {
      const teamSlug = teamMatch[1];
      const teamExists = currentMembership.teams.some(
        (t) => t.slug === teamSlug
      );

      if (!teamExists) {
        if (currentMembership.teams.length > 0) {
          const targetUrl = `/${workspaceSlug}/team/${currentMembership.teams[0].slug}`;
          const response = NextResponse.redirect(
            new URL(targetUrl, request.url)
          );
          setLastValidUrl(response, targetUrl);
          return response;
        } else {
          const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
          return NextResponse.redirect(new URL(fallbackUrl, request.url));
        }
      }

      // Valid team URL - save it and add auth data to headers
      const response = NextResponse.next();
      setLastValidUrl(response, pathname);
      response.headers.set("x-user-data", JSON.stringify(authData));
      return response;
    }
  }

  // Any other invalid path
  const fallbackUrl = getFallbackUrl(memberships, lastValidUrl);
  return NextResponse.redirect(new URL(fallbackUrl, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/register).*)",
  ],
};
