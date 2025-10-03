export interface TeamMember {
  userId: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  role: "admin" | "member" | "guest";
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  archived: boolean;
  workspaceId: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  memberships: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
}

export interface CreateTeamPayload {
  name: string;
  slug: string;
  workspaceId: string;
  description?: string;
}
