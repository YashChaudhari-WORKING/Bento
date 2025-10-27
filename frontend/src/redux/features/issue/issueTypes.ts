// store/types/issueTypes.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  identifier: string;
  number: number;
  status: IssueStatus;
  priority: IssuePriority;
  teamId: Team;
  workspaceId: Workspace;
  assigneeId?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = "backlog" | "todo" | "in_progress" | "done";

export type IssuePriority =
  | "no_priority"
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface IssueFilters {
  teamId: string | null;
  assigneeId: string | null;
  status: IssueStatus | null;
  priority: IssuePriority | null;
}

export interface IssuePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IssueLoading {
  fetch: boolean;
  create: boolean;
}

export interface IssueError {
  fetch: string | null;
  create: string | null;
}

export interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  filters: IssueFilters;
  pagination: IssuePagination;
  loading: IssueLoading;
  error: IssueError;

  // Modal state for create issue
  isCreateModalOpen: boolean;
}

export interface CreateIssueData {
  title: string;
  description?: string;
  teamId: string;
  assigneeId?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IssuesResponse {
  data: Issue[];
  pagination: IssuePagination;
}

export interface RootState {
  issues: IssueState;
}
