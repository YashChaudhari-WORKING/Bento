export interface Team {
  _id: string;
  name: string;
  slug: string;
  role: string;
}
export interface Memberships {
  workspace: {
    _id: string;
    name: string;
    slug: string;
  };
  role: string;
  teams: Team[];
}
export interface workspaceState {
  memberships: Memberships[];
  currentWorkspaceId: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}
