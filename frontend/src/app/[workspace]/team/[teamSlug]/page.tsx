// app/[workspace]/team/[teamSlug]/page.tsx
"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authThunks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  setCurrentWorkspace,
  addWorkspace,
} from "@/redux/features/workspace/workspaceSlice";
import { useMemberships } from "@/hooks/useMemberships";
import { useState } from "react";

export default function TeamPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkspace, workspaces } = useSelector(
    (state: RootState) => state.workspace
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { allMemberships, findMembershipBySlug, findMembershipById } =
    useMemberships();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;
  const teamSlug = params.teamSlug as string;

  // Find current membership and team
  const currentMembership = findMembershipBySlug(workspaceSlug);
  const currentTeam = currentMembership?.teams?.find(
    (t) => t.slug === teamSlug
  );

  const handleChangeWorkspace = async (ws: any) => {
    try {
      setNavigationError(null);
      dispatch(setCurrentWorkspace(ws));

      const membership = findMembershipById(ws._id);

      if (membership && membership.teams && membership.teams.length > 0) {
        const firstTeam = membership.teams[0];
        await router.push(`/${ws.slug}/team/${firstTeam.slug}`);
      } else {
        await router.push(`/${ws.slug}`);
      }
    } catch (error) {
      console.error("Workspace change error:", error);
      setNavigationError("Failed to change workspace. Please try again.");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await dispatch(logout()).unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setNavigationError("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAddWorkspace = () => {
    try {
      const newWorkspaceData = {
        workspace: {
          _id: "68769b89e4d87b8aff3bd246",
          name: "Marketing Hub",
          slug: "marketinghub",
        },
        membership: {
          workspace: {
            _id: "68769b89e4d87b8aff3bd246",
            name: "Marketing Hub",
            slug: "marketinghub",
          },
          role: "admin",
          teams: [
            {
              _id: "68769b89e4d87b8aff3bd228",
              name: "Creative Team",
              slug: "creativeteam",
              role: "admin",
            },
          ],
        },
      };

      dispatch(addWorkspace(newWorkspaceData));
    } catch (error) {
      console.error("Add workspace error:", error);
      setNavigationError("Failed to add workspace. Please try again.");
    }
  };

  // Loading or error state
  if (!currentTeam || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Team not found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested team could not be found in this workspace.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Go to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {navigationError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{navigationError}</p>
              <button
                onClick={() => setNavigationError(null)}
                className="text-sm text-red-600 underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Switcher */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Switch Workspace:
          </h3>
          <div className="flex flex-wrap gap-2">
            {workspaces.map((ws) => (
              <button
                key={ws._id}
                onClick={() => handleChangeWorkspace(ws)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  currentWorkspace._id === ws._id
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {ws.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug/Test Section - Remove in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Actions:</h4>
          <button
            onClick={handleAddWorkspace}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Add Test Workspace
          </button>
        </div>

        {/* Team Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentTeam.name} Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to the {currentTeam.name} team in {currentWorkspace.name}{" "}
            workspace.
          </p>
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Team Information:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <strong>Team:</strong> {currentTeam.name}
              </li>
              <li>
                <strong>Role:</strong> {currentTeam.role}
              </li>
              <li>
                <strong>Workspace:</strong> {currentWorkspace.name}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
