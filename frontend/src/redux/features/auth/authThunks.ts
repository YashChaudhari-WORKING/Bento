import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/lib/axios";
import { User } from "./authTypes";

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await instance.post("/auth/login", formData);
    return res.data.user;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.msg || "Login failed");
  }
});

export const signup = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signup", async (formData, { rejectWithValue }) => {
  try {
    const res = await instance.post("/auth/signup", formData);
    return res.data.user;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.msg || "Signup Failed");
  }
});

export const authCheck = createAsyncThunk<
  { user: User; memberships: any[] },
  void,
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await instance.get("/auth/me");
    return {
      user: res.data.user,
      memberships: res.data.memberships,
    };
  } catch (error: any) {
    // Don't treat 401/403 as errors - user just isn't logged in
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return rejectWithValue("UNAUTHORIZED");
    }
    return rejectWithValue(error?.response?.data?.msg || "Auth Check Failed");
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await instance.post("/auth/logout");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.msg || "Logout failed");
    }
  }
);
