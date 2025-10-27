// store/selectors/issueSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./issueTypes";

// Basic selectors
export const selectIssueState = (state: RootState) => state.issues;

export const selectIssues = (state: RootState) => state.issues.issues;

export const selectCurrentIssue = (state: RootState) =>
  state.issues.currentIssue;

export const selectIssuesLoading = (state: RootState) => state.issues.loading;

export const selectIssuesError = (state: RootState) => state.issues.error;

export const selectIssueFilters = (state: RootState) => state.issues.filters;

export const selectIssuePagination = (state: RootState) =>
  state.issues.pagination;

export const selectIsCreateModalOpen = (state: RootState) =>
  state.issues.isCreateModalOpen;

// Derived selectors
export const selectIssuesByStatus = createSelector([selectIssues], (issues) => {
  return issues.reduce((acc, issue) => {
    if (!acc[issue.status]) {
      acc[issue.status] = [];
    }
    acc[issue.status].push(issue);
    return acc;
  }, {} as Record<string, typeof issues>);
});

export const selectIssuesByPriority = createSelector(
  [selectIssues],
  (issues) => {
    return issues.reduce((acc, issue) => {
      if (!acc[issue.priority]) {
        acc[issue.priority] = [];
      }
      acc[issue.priority].push(issue);
      return acc;
    }, {} as Record<string, typeof issues>);
  }
);

export const selectIssuesByAssignee = createSelector(
  [selectIssues],
  (issues) => {
    return issues.reduce((acc, issue) => {
      const assigneeId = issue.assigneeId?._id || "unassigned";
      if (!acc[assigneeId]) {
        acc[assigneeId] = [];
      }
      acc[assigneeId].push(issue);
      return acc;
    }, {} as Record<string, typeof issues>);
  }
);

export const selectFilteredIssues = createSelector(
  [selectIssues, selectIssueFilters],
  (issues, filters) => {
    return issues.filter((issue) => {
      if (filters.teamId && issue.teamId._id !== filters.teamId) return false;
      if (filters.assigneeId && issue.assigneeId?._id !== filters.assigneeId)
        return false;
      if (filters.status && issue.status !== filters.status) return false;
      if (filters.priority && issue.priority !== filters.priority) return false;
      return true;
    });
  }
);

export const selectIssueStats = createSelector([selectIssues], (issues) => {
  return {
    total: issues.length,
    byStatus: {
      backlog: issues.filter((i) => i.status === "backlog").length,
      todo: issues.filter((i) => i.status === "todo").length,
      in_progress: issues.filter((i) => i.status === "in_progress").length,
      done: issues.filter((i) => i.status === "done").length,
    },
    byPriority: {
      no_priority: issues.filter((i) => i.priority === "no_priority").length,
      low: issues.filter((i) => i.priority === "low").length,
      medium: issues.filter((i) => i.priority === "medium").length,
      high: issues.filter((i) => i.priority === "high").length,
      urgent: issues.filter((i) => i.priority === "urgent").length,
    },
    assigned: issues.filter((i) => i.assigneeId).length,
    unassigned: issues.filter((i) => !i.assigneeId).length,
  };
});

export const selectIsLoading = createSelector(
  [selectIssuesLoading],
  (loading) => loading.fetch || loading.create
);

export const selectHasErrors = createSelector([selectIssuesError], (error) =>
  Boolean(error.fetch || error.create)
);
