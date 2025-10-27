"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useMemberships } from "@/hooks/useMemberships";

export default function TeamPage() {
  const { currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { findMembershipBySlug } = useMemberships();

  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const teamSlug = params.teamSlug as string;

  // Find current membership and team from the correct workspace
  const currentMembership = findMembershipBySlug(workspaceSlug);
  const currentTeam = currentMembership?.teams?.find(
    (t) => t.slug === teamSlug
  );

  // Show error if team not found
  if (!currentTeam || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Team not found
          </h2>
          <p className="text-gray-600">
            The team "{teamSlug}" was not found in workspace "{workspaceSlug}".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-lg text-gray-900">
              {currentWorkspace.name} → {currentTeam.name}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {currentTeam.name} Team
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Workspace:</strong> {currentWorkspace.name}
            </p>
            <p>
              <strong>Team:</strong> {currentTeam.name}
            </p>
            <p>
              <strong>Team Slug:</strong> {currentTeam.slug}
            </p>
            <p>
              <strong>Role:</strong> {currentTeam.role}
            </p>
            <p>
              <strong>User:</strong> {user?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
