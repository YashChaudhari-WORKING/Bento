import { RootState } from "@/redux/store";

export const selectMemberships = (state: RootState) =>
  state.workspace.memberships;

export const selectCurrentWorkspace = (state: RootState) =>
  state.workspace.currentWorkspace;

export const selectCurrentWorkspaceTeams = (state: RootState) => {
  const currentWorkspace = state.workspace.currentWorkspace;
  if (!currentWorkspace) return [];

  const membership = state.workspace.memberships.find(
    (m) => m.workspace._id === currentWorkspace._id
  );

  return membership ? membership.teams : [];
};
