// app/[workspace]/team/[teamSlug]/page.tsx
"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authThunks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

export default function TeamPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkspace, memberships, user } = useSelector(
    (state: RootState) => state.auth
  );
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;
  const teamSlug = params.teamSlug as string;

  const currentMembership = memberships.find(
    (m) => m.workspace.slug === workspaceSlug
  );
  const currentTeam = currentMembership?.teams.find((t) => t.slug === teamSlug);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!currentTeam || !currentWorkspace) {
    return null; // Middleware will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentWorkspace.name}
              </h1>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">{currentTeam.name}</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <span>{currentWorkspace.name}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {currentTeam.name}
            </span>
          </nav>

          <h2 className="text-3xl font-bold text-gray-900">
            {currentTeam.name}
          </h2>
          <p className="text-gray-600 mt-2">
            Role:{" "}
            <span className="font-medium capitalize">{currentTeam.role}</span>
          </p>
        </div>

        {/* Team Dashboard */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Team Dashboard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Team</h4>
                <p className="text-gray-600 text-sm mt-1">{currentTeam.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Slug: {currentTeam.slug}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Workspace</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {currentWorkspace.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Slug: {currentWorkspace.slug}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Your Role</h4>
                <p className="text-gray-600 text-sm mt-1 capitalize">
                  {currentTeam.role}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Workspace Role: {currentMembership?.role}
                </p>
              </div>
            </div>

            {/* Available Teams */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">
                Available Teams in this Workspace
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentMembership?.teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() =>
                      router.push(`/${workspaceSlug}/team/${team.slug}`)
                    }
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      team.slug === teamSlug
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      Role: {team.role}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Workspaces */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">
                Your Workspaces
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {memberships.map((membership) => (
                  <button
                    key={membership.workspace._id}
                    onClick={() => {
                      const firstTeam = membership.teams[0];
                      if (firstTeam) {
                        router.push(
                          `/${membership.workspace.slug}/team/${firstTeam.slug}`
                        );
                      }
                    }}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      membership.workspace.slug === workspaceSlug
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {membership.workspace.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 capitalize">
                          Role: {membership.role}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {membership.teams.length} team
                        {membership.teams.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
