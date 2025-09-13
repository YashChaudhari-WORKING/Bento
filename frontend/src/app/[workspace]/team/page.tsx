// app/[workspace]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemberships } from "@/hooks/useMemberships";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TeamIndexPage() {
  const { findMembershipBySlug, initialized } = useMemberships();
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;

  // Loading state
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const currentMembership = findMembershipBySlug(workspaceSlug);

  const handleGoToWorkspaceHome = () => {
    try {
      router.push(`/${workspaceSlug}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleTeamSelect = (teamSlug: string) => {
    try {
      router.push(`/${workspaceSlug}/team/${teamSlug}`);
    } catch (error) {
      console.error("Team navigation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Select a Team
          </h1>

          {!currentMembership ? (
            <div>
              <p className="text-gray-600 mb-4">
                No membership found for this workspace.
              </p>
              <p className="text-sm text-gray-500">
                Please contact your administrator or check if you have access to
                this workspace.
              </p>
            </div>
          ) : !currentMembership.teams ||
            currentMembership.teams.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                No teams available in this workspace.
              </p>
              <button
                onClick={handleGoToWorkspaceHome}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Workspace Home
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-8">
                Choose one of your available teams:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {currentMembership.teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => handleTeamSelect(team.slug)}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      Role: {team.role}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
