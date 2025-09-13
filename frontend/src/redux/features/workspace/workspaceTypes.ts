import { Workspace, Membership } from "../auth/authTypes";

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  memberships: Membership[];
  loading: boolean;
  error: string | null;
}
