// redux/features/auth/authTypes.ts
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  role: string;
}

export interface Membership {
  workspace: Workspace;
  role: string;
  teams: Team[];
}

export interface AuthState {
  user: User | null;
  memberships: Membership[];
  currentWorkspace: Workspace | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
