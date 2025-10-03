// hooks/useMemberships.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useMemo, useEffect } from "react";
import { setTeams } from "@/redux/features/team/teamSlice";

export function useMemberships() {
  const dispatch = useDispatch<AppDispatch>();
  const { memberships, currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const initialized = !!user;

  const findMembershipBySlug = useMemo(() => {
    return (workspaceSlug: string) => {
      return memberships.find((m) => m.workspace.slug === workspaceSlug);
    };
  }, [memberships]);

  const currentMembership = useMemo(() => {
    if (!currentWorkspace) return null;
    return memberships.find((m) => m.workspace._id === currentWorkspace._id);
  }, [memberships, currentWorkspace]);

  // Sync teams with team slice when workspace changes
  useEffect(() => {
    if (currentMembership?.teams) {
      // Convert membership teams to full Team objects
      const teams = currentMembership.teams.map((t) => ({
        _id: t._id,
        name: t.name,
        slug: t.slug,
        workspaceId: currentWorkspace!._id,
        // Add other team properties as needed
      }));
      dispatch(setTeams(teams));
    }
  }, [currentMembership, currentWorkspace, dispatch]);

  return {
    memberships,
    currentMembership,
    findMembershipBySlug,
    initialized,
  };
}
