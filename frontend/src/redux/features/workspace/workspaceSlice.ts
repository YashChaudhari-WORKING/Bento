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

      // Set current workspace to first one if none selected
      if (!state.currentWorkspace && workspaces.length > 0) {
        state.currentWorkspace = workspaces[0];
      }
    },

    // Set current workspace
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },

    // Add single workspace (for future API calls)
    addWorkspace: (
      state,
      action: PayloadAction<{ workspace: Workspace; membership: Membership }>
    ) => {
      const { workspace, membership } = action.payload;
      // Check if workspace already exists
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

        // Update current workspace if it's the one being updated
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

      // Clear current workspace if it's the one being removed
      if (state.currentWorkspace?._id === action.payload) {
        state.currentWorkspace =
          state.workspaces.length > 0 ? state.workspaces[0] : null;
      }
    },

    // Clear workspace state
    clearWorkspaces: (state) => {
      Object.assign(state, initialState);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
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
      // highlight-start
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        // Destructure the full response from the payload
        const { workspace, team } = action.payload;

        // 1. Add the new workspace to the list of all workspaces
        state.workspaces.push(workspace);

        // 2. Construct the new membership object correctly
        // This now matches the structure in your Redux state
        const newMembership = {
          workspace: {
            _id: workspace._id,
            name: workspace.name,
            slug: workspace.slug,
          },
          role: "admin", // The creator is an admin of the workspace
          teams: [
            {
              _id: team._id,
              name: team.name,
              slug: team.slug,
              role: "admin",
            },
          ],
        };

        // This type assertion might be needed if your Membership type is slightly different
        state.memberships.push(newMembership as Membership);

        // 3. Set the newly created workspace as the active one
        state.currentWorkspace = workspace;
      })
      // highlight-end
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

export const {
  setWorkspacesFromAuth,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  clearWorkspaces,
  setLoading,
  setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
