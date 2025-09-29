import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  toggleSidebar,
  closeSidebar,
  togglePin,
  setActiveItem,
  setSeenHint,
} from "@/redux/features/layout/sidebarSlice";
import { Menu, X, Zap, Target, ChevronLeft, Plus } from "lucide-react";
import WorkspaceDropdown from "../sidebar/MainDropdown";
import TeamDrawer from "../sidebar/TeamDrawer";
import { useRouter } from "next/navigation";
import { selectCurrentWorkspaceTeams } from "@/redux/features/workspace/workspaceSelectors";

import { getLuminance } from "polished";
import stc from "string-to-color";
interface sidebarProps {
  menuType?: "default" | "settings";
}

const Sidebar: React.FC<sidebarProps> = ({ menuType }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const isPinned = useSelector((state: RootState) => state.sidebar.isPinned);
  const router = useRouter();
  const [hoverZone, setHoverZone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const teams = useSelector(selectCurrentWorkspaceTeams);
  const { currentWorkspace, workspaces } = useSelector(
    (state: RootState) => state.workspace
  );

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || isPinned) return;

    const handleMouseMove = (e: MouseEvent) => {
      const isInHotZone = e.clientX <= 20;
      if (isInHotZone && !isOpen) {
        setHoverZone(true);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
          dispatch(toggleSidebar());
        }, 150);
      } else if (!isInHotZone && hoverZone) {
        setHoverZone(false);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      }
    };

    const handleMouseLeave = () => {
      if (!isPinned && isOpen) {
        setTimeout(() => dispatch(closeSidebar()), 300);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    if (sidebarRef.current) {
      sidebarRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, [isOpen, isPinned, hoverZone, isMobile, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        dispatch(closeSidebar());
      }
      if (e.ctrlKey && e.key === "\\") {
        dispatch(toggleSidebar());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="fixed top-4 left-4 z-50 p-2 bg-[#090909] text-white rounded-lg shadow-lg hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Desktop hover trigger */}
      {!isMobile && !isOpen && !isPinned && (
        <div className="fixed left-0 top-0 w-1 h-full z-40 group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full animate-pulse" />
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20 hover:w-2 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300 opacity-60 hover:opacity-100"
          />
        </div>
      )}
      {isOpen && !isPinned && !isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed border-r-1 border-[#565758] left-0 top-0 h-full w-64 bg-[#090909] text-white transition-transform duration-300 z-40 shadow-2xl ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isOpen || isPinned
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {menuType === "default" ? (
          <div>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <WorkspaceDropdown />
              </div>
              {!isMobile && (
                <button
                  onClick={() => dispatch(togglePin())}
                  className={`p-1 rounded transition-colors ${
                    isPinned
                      ? "text-blue-400 bg-blue-500/20"
                      : "text-slate-400 hover:text-blue-400"
                  }`}
                  title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                  <Target className="w-4 h-4" />
                </button>
              )}
              {isMobile && (
                <button
                  onClick={() => dispatch(closeSidebar())}
                  className="text-slate-400 hover:text-white p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <TeamDrawer />
          </div>
        ) : (
          <div className="p-2.5">
            <button
              onClick={() => router.back()}
              className="bg-[#1E2025] flex justify-between text-[#7E7F81] mt-2 text-[13px] hover:text-white items-center cursor-pointer px-1 rounded-[5px]"
            >
              <ChevronLeft className="w-5 h-5"> </ChevronLeft> Back to app
            </button>

            <div className="text-white p-3 text-[13px]">
              {/* Header */}
              <div className="text-gray-400 mb-1 p-1 font-medium">
                Your teams
              </div>

              {/* Team List */}
              <div className="space-y-2">
                {teams.map((team) => {
                  // Generate deterministic color
                  const badgeColor = stc(team.slug || team.name);
                  const textColor =
                    getLuminance(badgeColor) > 0.5 ? "#000000" : "#FFFFFF";

                  return (
                    <div
                      key={team._id}
                      className="flex items-center gap-2 px-1 py-1 hover:bg-[#151619] rounded cursor-pointer transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-[13px] shadow"
                        style={{
                          backgroundColor: badgeColor,
                          color: textColor,
                        }}
                      >
                        {team.slug[0].toUpperCase()}
                      </div>

                      {/* Team Name */}
                      <span className="font-medium text-[13px] capitalize">
                        {team.name}
                      </span>
                    </div>
                  );
                })}

                {/* Create New Team Button */}
                <button
                  onClick={() =>
                    router.push(`/${currentWorkspace?.slug}/settings/new-team`)
                  }
                  className="flex items-center  gap-1 px-1 py-1 hover:bg-[#151619] rounded cursor-pointer text-blue-400 font-medium text-[13px] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create a Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
