import { RootState } from "../../store";

export const selectTeams = (state: RootState) => state.team.teams;

export const selectCurrentTeam = (state: RootState) => state.team.currentTeam;

export const selectTeamLoading = (state: RootState) => state.team.loading;

export const selectTeamError = (state: RootState) => state.team.error;

// Get team by ID
export const selectTeamById = (teamId: string) => (state: RootState) =>
  state.team.teams.find((t) => t._id === teamId);

// Get teams for current workspace
export const selectTeamsByWorkspace =
  (workspaceId: string) => (state: RootState) =>
    state.team.teams.filter((t) => t.workspaceId === workspaceId);

// Check if user is team admin
export const selectIsTeamAdmin =
  (teamId: string, userId: string) => (state: RootState) => {
    const team = state.team.teams.find((t) => t._id === teamId);
    return team?.memberships.some(
      (m) => m.userId._id === userId && m.role === "admin"
    );
  };
