import { createAsyncThunk } from "@reduxjs/toolkit";
import { teamAPI } from "@/lib/axios";
import { Team, CreateTeamPayload } from "./teamTypes";

// Create Team
export const createTeam = createAsyncThunk<
  Team,
  CreateTeamPayload,
  { rejectValue: string }
>("team/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await teamAPI.createTeam(payload);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.msg || "Failed to create team"
    );
  }
});

// Fetch Teams
export const fetchTeams = createAsyncThunk<
  Team[],
  string,
  { rejectValue: string }
>("team/fetchAll", async (workspaceId, { rejectWithValue }) => {
  try {
    const response = await teamAPI.getTeams(workspaceId);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.msg || "Failed to fetch teams"
    );
  }
});
