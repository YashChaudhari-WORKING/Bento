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
  lastValidUrl?: string,
  useLastValid: boolean = true // Add parameter to control behavior
): string {
  // Only use lastValidUrl if explicitly requested and it's valid
  if (useLastValid && lastValidUrl) {
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

  // Default fallback logic
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

  const authData = await validateAuth(request);
  if (!authData) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname.includes("/settings")) {
    const response = NextResponse.next();
    response.headers.set("x-user-data", JSON.stringify(authData));
    return response;
  }

  const { memberships } = authData;
  const lastValidUrl = getLastValidUrl(request);

  // Handle root path - use lastValidUrl
  if (pathname === "/") {
    const fallbackUrl = getFallbackUrl(memberships, lastValidUrl, true);
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
      // Don't use lastValidUrl for invalid team navigation
      const fallbackUrl = getFallbackUrl(memberships, lastValidUrl, false);
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }
  }

  // Handle incomplete URLs
  if (pathname === "/team" || pathname === "/workspace") {
    // Don't use lastValidUrl for incomplete URLs
    const fallbackUrl = getFallbackUrl(memberships, lastValidUrl, false);
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
      // ✅ This is where the issue was - when workspace doesn't exist in auth.memberships
      // Don't redirect to lastValidUrl, allow the workspace change to happen
      console.log(`Workspace ${workspaceSlug} not found in memberships`);

      // Instead of immediately falling back, let it continue to the page
      // The page will handle the case where workspace isn't in auth.memberships
      // but exists in workspace.memberships
      const response = NextResponse.next();
      return response;
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

    if (subPath.startsWith("settings")) {
      // Allow settings routes to pass through
      const response = NextResponse.next();
      response.headers.set("x-user-data", JSON.stringify(authData));
      return response;
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
          const fallbackUrl = getFallbackUrl(memberships, lastValidUrl, false);
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

  // Any other invalid path - don't use lastValidUrl
  const fallbackUrl = getFallbackUrl(memberships, lastValidUrl, false);
  return NextResponse.redirect(new URL(fallbackUrl, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/register).*)",
  ],
};
