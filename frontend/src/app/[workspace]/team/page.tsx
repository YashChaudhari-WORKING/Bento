// app/[workspace]/team/page.tsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TeamIndexPage() {
  const { memberships, currentWorkspace } = useSelector(
    (state: RootState) => state.auth
  );
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    if (!currentWorkspace) return;

    // Find current membership
    const currentMembership = memberships.find(
      (m) => m.workspace.slug === workspaceSlug
    );

    if (currentMembership) {
      if (currentMembership.teams.length > 0) {
        // Redirect to first available team
        const firstTeam = currentMembership.teams[0];
        router.replace(`/${workspaceSlug}/team/${firstTeam.slug}`);
      } else {
        // No teams available, redirect to workspace home
        router.replace(`/${workspaceSlug}`);
      }
    }
  }, [currentWorkspace, memberships, workspaceSlug, router]);

  const currentMembership = memberships.find(
    (m) => m.workspace.slug === workspaceSlug
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Select a Team
          </h1>

          {currentMembership?.teams.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                No teams available in this workspace.
              </p>
              <button
                onClick={() => router.push(`/${workspaceSlug}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Workspace Home
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-8">
                Redirecting to your first team...
              </p>
              <LoadingSpinner />

              {/* Show available teams while redirecting */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Available Teams:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {currentMembership?.teams.map((team) => (
                    <button
                      key={team._id}
                      onClick={() =>
                        router.push(`/${workspaceSlug}/team/${team.slug}`)
                      }
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        Role: {team.role}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
