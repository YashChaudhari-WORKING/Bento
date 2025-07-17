import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";
import { login, signup } from "./authThunks";
const initalState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initalState,
  reducers: {},
  extraReducers: (builder) => {
    const handleLoading = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulFilled = (state: AuthState, action: { payload: any }) => {
      state.user = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
    };
    const handleRejected = (state: AuthState, action: { payload: any }) => {
      state.error = action.payload;
      state.loading = false;
    };

    builder
      .addCase(login.pending, handleLoading)
      .addCase(login.fulfilled, handleFulFilled)
      .addCase(login.rejected, handleRejected)

      .addCase(signup.pending, handleLoading)
      .addCase(signup.fulfilled, handleFulFilled)
      .addCase(signup.rejected, handleRejected);
  },
});
export default authSlice.reducer;
