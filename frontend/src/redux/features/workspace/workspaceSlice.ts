import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "./workspaceTypes";
import { Workspace, Membership } from "../auth/authTypes";
import { createWorkspace } from "./workspaceThunks";

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  memberships: [],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // Set workspaces from auth data
    setWorkspacesFromAuth: (state, action: PayloadAction<Membership[]>) => {
      const workspaces = action.payload.map(
        (membership) => membership.workspace
      );
      state.workspaces = workspaces;
      state.memberships = action.payload;

      if (!state.currentWorkspace && workspaces.length > 0) {
        state.currentWorkspace = workspaces[0];
      }
    },

    // Set current workspace
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },

    // Add new team to current workspace membership
    addTeamToWorkspace: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        team: { _id: string; name: string; slug: string; role: string };
      }>
    ) => {
      const { workspaceId, team } = action.payload;
      const membershipIndex = state.memberships.findIndex(
        (m) => m.workspace._id === workspaceId
      );

      if (membershipIndex !== -1) {
        // Check if team already exists
        const teamExists = state.memberships[membershipIndex].teams.some(
          (t) => t._id === team._id
        );
        if (!teamExists) {
          state.memberships[membershipIndex].teams.push(team);
        }
      }
    },

    // Add single workspace
    addWorkspace: (
      state,
      action: PayloadAction<{ workspace: Workspace; membership: Membership }>
    ) => {
      const { workspace, membership } = action.payload;
      const existingIndex = state.workspaces.findIndex(
        (w) => w._id === workspace._id
      );
      if (existingIndex === -1) {
        state.workspaces.push(workspace);
        state.memberships.push(membership);
      }
    },

    // Update workspace
    updateWorkspace: (state, action: PayloadAction<Workspace>) => {
      const index = state.workspaces.findIndex(
        (w) => w._id === action.payload._id
      );
      if (index !== -1) {
        state.workspaces[index] = action.payload;

        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      }
    },

    // Remove workspace
    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (w) => w._id !== action.payload
      );
      state.memberships = state.memberships.filter(
        (m) => m.workspace._id !== action.payload
      );

      if (state.currentWorkspace?._id === action.payload) {
        state.currentWorkspace =
          state.workspaces.length > 0 ? state.workspaces[0] : null;
      }
    },

    // Clear workspace state
    clearWorkspaces: (state) => {
      Object.assign(state, initialState);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        const { workspace, team } = action.payload;

        state.workspaces.push(workspace);

        const newMembership = {
          workspace: {
            _id: workspace._id,
            name: workspace.name,
            slug: workspace.slug,
          },
          role: "admin",
          teams: [
            {
              _id: team._id,
              name: team.name,
              slug: team.slug,
              role: "admin",
            },
          ],
        };

        state.memberships.push(newMembership as Membership);
        state.currentWorkspace = workspace;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

export const {
  setWorkspacesFromAuth,
  setCurrentWorkspace,
  addTeamToWorkspace,
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  clearWorkspaces,
  setLoading,
  setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
