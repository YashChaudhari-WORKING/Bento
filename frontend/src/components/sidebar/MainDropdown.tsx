"use client";

import React, { useState, useRef, useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useMemberships } from "@/hooks/useMemberships";
import { setCurrentWorkspace } from "@/redux/features/auth/authSlice";
import type { AppDispatch } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronsRight, Check, Plus } from "lucide-react";
import { logout } from "@/redux/features/auth/authThunks";
import { clearTeams, setTeams } from "@/redux/features/team/teamSlice";

const WorkspaceDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showWorkspaces, setShowWorkspaces] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const { currentWorkspace, workspaces } = useSelector(
    (state: RootState) => state.workspace
  );
  const { findMembershipBySlug } = useMemberships();

  const handleWorkspaceSwitch = async (workspace: any) => {
    try {
      // 1. Update workspace
      dispatch(setCurrentWorkspace(workspace));

      // 2. Clear old teams and set new ones
      const membership = findMembershipBySlug(workspace.slug);

      if (membership?.teams) {
        dispatch(setTeams(membership.teams)); // This sets teams and auto-sets first team as current
      } else {
        dispatch(clearTeams());
      }

      // 3. Navigate
      const targetPath = membership?.teams?.length
        ? `/${workspace.slug}/team/${membership.teams[0].slug}`
        : `/${workspace.slug}`;
      await router.push(targetPath);

      setIsOpen(false);
      setShowWorkspaces(false);
    } catch (error) {
      console.error("Failed to switch workspace:", error);
    }
  };

  const handleCreateWorkspace = () => {
    router.push("/join");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowWorkspaces(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-sm text-[#E4E6EB]" ref={dropdownRef}>
      {/* Main Dropdown Button */}
      <button
        className="flex items-center justify-between w-full px-2 py-1.5 gap-2 text-left rounded-md hover:bg-[#3A3B3C] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">BENTO</span>
        <ChevronDown size={16} className="text-[#B0B3B8]" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-48 mt-1.5 bg-[#242527] border border-[#3b3d3f] p-1.5 rounded-lg shadow-lg z-50">
          {/* Top Section */}
          <div className="space-y-1"></div>

          {/* Switch Workspace */}
          <div
            className="relative"
            onMouseEnter={() => setShowWorkspaces(true)}
            onMouseLeave={() => setShowWorkspaces(false)}
          >
            <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#3A3B3C] cursor-pointer">
              <span>Switch Workspace</span>
              <ChevronsRight size={16} className="text-[#B0B3B8]" />
            </div>

            {/* Workspace List Sub-menu */}
            {showWorkspaces && (
              <div className="absolute left-full top-0 min-w-48 p-1.5 ml-1 bg-[#242527] border border-[#3b3d3f] rounded-lg shadow-lg z-60">
                <div className="space-y-1">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#3A3B3C] transition-colors duration-200 ${
                        currentWorkspace?._id === workspace._id
                          ? "bg-[#3A3B3C]"
                          : ""
                      }`}
                      onClick={() => handleWorkspaceSwitch(workspace)}
                    >
                      <span>{workspace.name}</span>
                      {currentWorkspace?._id === workspace._id && (
                        <Check size={16} className="text-green-500" />
                      )}
                    </div>
                  ))}
                </div>

                <hr className="border-t border-[#3b3d3f] my-1.5" />

                <div
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#3A3B3C]"
                  onClick={handleCreateWorkspace}
                >
                  <Plus size={16} />
                  <span>Create Workspace</span>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => {
              router.push(`/${currentWorkspace?.slug}/settings`);
            }}
            className="px-2 py-1.5 rounded-md hover:bg-[#3A3B3C] cursor-pointer"
          >
            Settings
          </div>

          <hr className="border-t border-[#3b3d3f] my-1.5" />

          {/* Logout Option */}
          <div
            className="flex justify-between items-center px-2 py-1.5 rounded-md cursor-pointer text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
            onClick={handleLogout}
          >
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
