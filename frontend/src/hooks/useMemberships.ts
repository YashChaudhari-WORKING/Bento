// hooks/useMemberships.ts
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

export const useMemberships = () => {
  const { memberships: authMemberships, initialized } = useSelector(
    (state: RootState) => state.auth
  );
  const { memberships: workspaceMemberships } = useSelector(
    (state: RootState) => state.workspace
  );

  const allMemberships = useMemo(() => {
    // Combine and deduplicate memberships by workspace ID
    const combined = [...authMemberships];
    workspaceMemberships.forEach((wm) => {
      if (!combined.find((am) => am.workspace._id === wm.workspace._id)) {
        combined.push(wm);
      }
    });
    return combined;
  }, [authMemberships, workspaceMemberships]);

  const findMembershipBySlug = (slug: string) =>
    allMemberships.find((m) => m.workspace.slug === slug);

  const findMembershipById = (id: string) =>
    allMemberships.find((m) => m.workspace._id === id);

  return {
    authMemberships,
    workspaceMemberships,
    allMemberships,
    findMembershipBySlug,
    findMembershipById,
    initialized,
  };
};
