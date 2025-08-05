import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { workspaceState } from "./workspaceTypes";
import { authCheck } from "../auth/authThunks";

const initialState: workspaceState = {
  memberships: [],
  error: null,
  loading: false,
  currentWorkspaceId: null,
  isInitialized: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload;
      // Persist to localStorage for session restoration
      localStorage.setItem("currentWorkspaceId", action.payload);
    },
    clearWorkspace: (state) => {
      state.memberships = [];
      state.currentWorkspaceId = null;
      state.error = null;
      state.isInitialized = false;
      localStorage.removeItem("currentWorkspaceId");
    },
    restoreWorkspaceFromStorage: (state) => {
      const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (savedWorkspaceId && state.memberships.length > 0) {
        // Verify the workspace still exists in memberships
        const workspaceExists = state.memberships.some(
          (membership) => membership.workspace._id === savedWorkspaceId
        );
        if (workspaceExists) {
          state.currentWorkspaceId = savedWorkspaceId;
        }
      }
    },
  },
  extraReducers: (builder) => {
    const handleLoading = (state: workspaceState) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (
      state: workspaceState,
      action: { payload: any }
    ) => {
      state.memberships = action.payload;
      state.loading = false;
      state.error = null;
      state.isInitialized = true;

      // Set default workspace if none is selected
      if (state.currentWorkspaceId === null && state.memberships.length > 0) {
        const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
        const workspaceExists =
          savedWorkspaceId &&
          state.memberships.some(
            (membership) => membership.workspace._id === savedWorkspaceId
          );

        state.currentWorkspaceId = workspaceExists
          ? savedWorkspaceId
          : state.memberships[0].workspace._id;

        localStorage.setItem("currentWorkspaceId", state.currentWorkspaceId);
      }
    };

    const handleRejected = (
      state: workspaceState,
      action: { payload: any }
    ) => {
      state.error = action.payload;
      state.loading = false;
      state.isInitialized = true;
    };

    builder
      .addCase(authCheck.pending, handleLoading)
      .addCase(authCheck.fulfilled, handleFulfilled)
      .addCase(authCheck.rejected, handleRejected);
  },
});

export const {
  setCurrentWorkspace,
  clearWorkspace,
  restoreWorkspaceFromStorage,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
