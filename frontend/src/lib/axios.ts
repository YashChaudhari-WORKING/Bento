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

export default instance;
