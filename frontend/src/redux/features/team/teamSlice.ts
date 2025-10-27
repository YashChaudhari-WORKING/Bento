import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamState, Team } from "./teamTypes";
import { createTeam, fetchTeams } from "./teamThunks";

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // Set current team
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },

    // Set teams for current workspace
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      // Always set the first team as current when teams change
      state.currentTeam = action.payload.length > 0 ? action.payload[0] : null;
    },

    // Clear teams (when switching workspace)
    clearTeams: (state) => {
      state.teams = [];
      state.currentTeam = null;
    },

    // Update team
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.teams[index] = action.payload;
        if (state.currentTeam?._id === action.payload._id) {
          state.currentTeam = action.payload;
        }
      }
    },

    // Remove team
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((t) => t._id !== action.payload);
      if (state.currentTeam?._id === action.payload) {
        state.currentTeam = state.teams.length > 0 ? state.teams[0] : null;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Create Team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
        // Don't auto-set current team, let navigation handle it
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create team";
      })

      // Fetch Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
        if (!state.currentTeam && action.payload.length > 0) {
          state.currentTeam = action.payload[0];
        }
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch teams";
      });
  },
});

export const { setCurrentTeam, setTeams, clearTeams, updateTeam, removeTeam } =
  teamSlice.actions;

export default teamSlice.reducer;
