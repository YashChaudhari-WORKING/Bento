import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7001/api",
  withCredentials: true,
});

export const teamAPI = {
  createTeam: (data: {
    name: string;
    slug: string;
    workspaceId: string;
    description?: string;
  }) => instance.post("/teams", data),

  getTeams: (workspaceId: string) =>
    instance.get("/teams", { params: { workspaceId } }),
};

export const issueAPI = {
  // Create new issue
  createIssue: (issueData: {
    title: string;
    description?: string;
    teamId: string;
    assigneeId?: string;
    priority?: string;
    status?: string;
  }) => instance.post("/issues", issueData),

  // Get all issues with filters
  getIssues: (
    filters: {
      teamId?: string;
      workspaceId?: string;
      assigneeId?: string;
      status?: string;
      priority?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => instance.get("/issues", { params: filters }),

  // Get issue by ID
  getIssueById: (issueId: string) => instance.get(`/issues/${issueId}`),

  // Get issue by identifier (TEAM-123)
  getIssueByIdentifier: (identifier: string) =>
    instance.get(`/issues/identifier/${identifier}`),
};

export default instance;
