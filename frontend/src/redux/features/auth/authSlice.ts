// redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Workspace } from "./authTypes";
import { login, signup, authCheck, logout } from "./authThunks";

const initialState: AuthState = {
  user: null,
  memberships: [],
  currentWorkspace: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },
    clearAuth: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Auth Check
      .addCase(authCheck.pending, (state) => {
        if (!state.initialized) state.loading = true;
        state.error = null;
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.memberships = action.payload.memberships;
        state.isAuthenticated = true;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState, { initialized: true });
      });
  },
});

export const { setCurrentWorkspace, clearAuth } = authSlice.actions;
export default authSlice.reducer;
