// store/slices/issueSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IssueState, IssueFilters, IssuePagination } from "./issueTypes";
import {
  createIssue,
  fetchIssues,
  fetchIssueById,
  fetchIssueByIdentifier,
} from "./issueThunks";

const initialState: IssueState = {
  issues: [],
  currentIssue: null,

  // Filters
  filters: {
    teamId: null,
    assigneeId: null,
    status: null,
    priority: null,
  },

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Loading states
  loading: {
    fetch: false,
    create: false,
  },

  // Errors
  error: {
    fetch: null,
    create: null,
  },

  // Modal state
  isCreateModalOpen: false,
};

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IssueFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action: PayloadAction<Partial<IssuePagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    resetIssueState: (state) => {
      return initialState;
    },

    // Modal actions
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    toggleCreateModal: (state) => {
      state.isCreateModalOpen = !state.isCreateModalOpen;
    },
  },

  extraReducers: (builder) => {
    // Create Issue
    builder
      .addCase(createIssue.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading.create = false;
        state.issues.unshift(action.payload.data);
        state.pagination.total += 1;
        state.isCreateModalOpen = false; // Close modal on success
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload || "Failed to create issue";
      });

    // Fetch Issues
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.issues = action.payload.data.data;
        state.pagination = action.payload.data.pagination || state.pagination;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || "Failed to fetch issues";
      });

    // Fetch Issue by ID
    builder
      .addCase(fetchIssueById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentIssue = action.payload.data;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || "Failed to fetch issue";
      });

    // Fetch Issue by Identifier
    builder
      .addCase(fetchIssueByIdentifier.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchIssueByIdentifier.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentIssue = action.payload.data;
      })
      .addCase(fetchIssueByIdentifier.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || "Failed to fetch issue";
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearErrors,
  resetIssueState,
  openCreateModal,
  closeCreateModal,
  toggleCreateModal,
} = issueSlice.actions;

export default issueSlice.reducer;
