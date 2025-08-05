// hooks/useSmartRedirect.ts
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import { RootState } from "@/redux/store";

const LAST_VALID_URL_KEY = "lastValidTeamUrl";

export const useSmartRedirect = () => {
  const { memberships, isAuthenticated, initialized } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const workspaceSlug = params.workspace as string;
  const teamSlug = params.teamSlug as string;

  // Save/get last valid URL
  const getLastValidUrl = (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(LAST_VALID_URL_KEY);
  };

  const saveLastValidUrl = (url: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(LAST_VALID_URL_KEY, url);
    }
  };

  // Find team across all workspaces
  const findTeamInWorkspaces = (targetTeamSlug: string) => {
    for (const membership of memberships) {
      const team = membership.teams.find((t) => t.slug === targetTeamSlug);
      if (team) {
        return {
          workspace: membership.workspace,
          team,
          membership,
        };
      }
    }
    return null;
  };

  useEffect(() => {
    if (!initialized || !isAuthenticated) return;

    // Handle URLs without workspace (like /team/AGIN)
    if (pathname.startsWith("/team/") && !workspaceSlug) {
      const teamFromUrl = pathname.replace("/team/", "");
      const found = findTeamInWorkspaces(teamFromUrl);

      if (found) {
        const correctUrl = `/${found.workspace.slug}/team/${found.team.slug}`;
        router.replace(correctUrl);
        return;
      } else {
        // Team not found, redirect to last valid or fallback
        const lastValid = getLastValidUrl();
        if (lastValid) {
          router.replace(lastValid);
          return;
        }
        // Fallback to first available
        if (memberships.length > 0 && memberships[0].teams.length > 0) {
          const first = memberships[0];
          router.replace(
            `/${first.workspace.slug}/team/${first.teams[0].slug}`
          );
          return;
        }
      }
    }

    // Handle other invalid URLs (like just /team, /workspace, etc.)
    if (pathname === "/team" || pathname === "/workspace" || pathname === "/") {
      const lastValid = getLastValidUrl();
      if (lastValid) {
        router.replace(lastValid);
        return;
      }
      // Fallback
      if (memberships.length > 0 && memberships[0].teams.length > 0) {
        const first = memberships[0];
        router.replace(`/${first.workspace.slug}/team/${first.teams[0].slug}`);
        return;
      }
    }

    // Rest of existing logic for workspace-based URLs
    if (!workspaceSlug) return;

    const currentMembership = memberships.find(
      (m) => m.workspace.slug === workspaceSlug
    );

    if (!currentMembership) {
      const lastValid = getLastValidUrl();
      if (lastValid) {
        router.replace(lastValid);
        return;
      }
      if (memberships.length > 0 && memberships[0].teams.length > 0) {
        const first = memberships[0];
        router.replace(`/${first.workspace.slug}/team/${first.teams[0].slug}`);
      }
      return;
    }

    const isTeamIndex = pathname.endsWith("/team");
    const isWorkspaceHome = pathname === `/${workspaceSlug}`;
    const isSpecificTeam = teamSlug;
    const isValidTeam =
      isSpecificTeam &&
      currentMembership.teams.some((t) => t.slug === teamSlug);

    if (isTeamIndex || isWorkspaceHome) {
      if (currentMembership.teams.length > 0) {
        const targetUrl = `/${workspaceSlug}/team/${currentMembership.teams[0].slug}`;
        router.replace(targetUrl);
      }
      return;
    }

    if (isSpecificTeam && !isValidTeam) {
      if (currentMembership.teams.length > 0) {
        const targetUrl = `/${workspaceSlug}/team/${currentMembership.teams[0].slug}`;
        router.replace(targetUrl);
      }
      return;
    }

    // Save valid URL
    if (isValidTeam) {
      saveLastValidUrl(pathname);
    }
  }, [
    initialized,
    isAuthenticated,
    memberships,
    workspaceSlug,
    teamSlug,
    pathname,
    router,
  ]);
};
