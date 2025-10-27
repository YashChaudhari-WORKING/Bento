import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export const selectMemberships = (state: RootState) =>
  state.workspace.memberships;

export const selectCurrentWorkspace = (state: RootState) =>
  state.workspace.currentWorkspace;

export const selectCurrentWorkspaceTeams = createSelector(
  [selectMemberships, selectCurrentWorkspace],
  (memberships, currentWorkspace) => {
    if (!currentWorkspace) return [];

    const membership = memberships.find(
      (m) => m.workspace._id === currentWorkspace._id
    );

    return membership ? membership.teams : [];
  }
);
