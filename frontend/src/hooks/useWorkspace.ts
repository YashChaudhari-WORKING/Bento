// hooks/useWorkspace.ts
"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { setCurrentWorkspace } from "@/redux/features/auth/authSlice";
import { AppDispatch, RootState } from "@/redux/store";

export const useWorkspace = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberships, currentWorkspace, isAuthenticated, initialized } =
    useSelector((state: RootState) => state.auth);
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;

  // Find current membership
  const currentMembership = useMemo(() => {
    return memberships.find((m) => m.workspace.slug === workspaceSlug);
  }, [memberships, workspaceSlug]);

  useEffect(() => {
    if (!initialized || !isAuthenticated) return;

    if (!currentMembership) {
      // Redirect to first available workspace or login
      if (memberships.length > 0) {
        const firstWorkspace = memberships[0].workspace;
        const firstTeam = memberships[0].teams[0];

        if (firstTeam) {
          router.replace(`/${firstWorkspace.slug}/team/${firstTeam.slug}`);
        } else {
          router.replace(`/${firstWorkspace.slug}`);
        }
      } else {
        router.push("/login");
      }
      return;
    }

    // Set current workspace if different
    if (!currentWorkspace || currentWorkspace.slug !== workspaceSlug) {
      dispatch(setCurrentWorkspace(currentMembership.workspace));
    }
  }, [
    currentMembership,
    currentWorkspace,
    workspaceSlug,
    memberships,
    isAuthenticated,
    initialized,
    dispatch,
    router,
  ]);

  return {
    currentMembership,
    currentWorkspace,
    isLoading: !initialized || (!currentMembership && isAuthenticated),
  };
};
