import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import stringToColor from "string-to-color";
import { getLuminance } from "polished";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  selectCurrentWorkspaceTeams,
  selectCurrentWorkspace,
} from "@/redux/features/workspace/workspaceSelectors";

// Team menu - all direct links
const teamMenu = [
  {
    id: "issues",
    label: "Issues",
    icon: "/icon/issue.png",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "/icon/project.png",
  },
  {
    id: "views",
    label: "Views",
    icon: "/icon/views.png",
  },
];

const TeamDrawer: React.FC = () => {
  const router = useRouter();
  const teams = useSelector(selectCurrentWorkspaceTeams);
  const workspace = useSelector(selectCurrentWorkspace);

  const [openTeams, setOpenTeams] = useState<string[]>([]);
  const [openMenuItems, setOpenMenuItems] = useState<string[]>([]);
  const [showTeams, setShowTeams] = useState<boolean>(true);

  const toggleTeam = (id: string) => {
    setOpenTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleMenuItem = (teamId: string, menuId: string) => {
    const key = `${teamId}-${menuId}`;
    setOpenMenuItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const generateUrl = (teamSlug: string, menuId: string) => {
    if (!workspace?.slug) return "#";

    // Issues always redirect to "all"
    if (menuId === "issues") {
      return `/${workspace.slug}/team/${teamSlug}/all`;
    }

    return `/${workspace.slug}/team/${teamSlug}/${menuId}`;
  };

  const isActiveRoute = (url: string) => {
    return router.asPath === url;
  };

  return (
    <div className="text-white p-3 text-[13px]">
      {/* Header */}
      <div
        onClick={() => setShowTeams(!showTeams)}
        className="text-gray-400 hover:bg-[#151619] flex items-center gap-2 mb-2 p-1 font-medium cursor-pointer rounded"
      >
        Your teams
        <ChevronDown
          size={16}
          className={`opacity-70 transition-transform duration-200 ${
            showTeams ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

      {/* Team List */}
      {showTeams && (
        <div className="space-y-2">
          {teams.map((team) => {
            const isOpen = openTeams.includes(team._id);

            // Generate deterministic color
            const badgeColor = stringToColor(team.slug || team.name);
            const textColor =
              getLuminance(badgeColor) > 0.5 ? "#000000" : "#FFFFFF";

            return (
              <div key={team._id}>
                {/* Team Header */}
                <button
                  onClick={() => toggleTeam(team._id)}
                  className="flex w-full items-center justify-between cursor-pointer px-2 py-1 hover:bg-[#151619] rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {/* Badge */}
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-[13px] shadow"
                      style={{ backgroundColor: badgeColor, color: textColor }}
                    >
                      {team.slug[0].toUpperCase()}
                    </div>

                    {/* Team Name */}
                    <span className="font-medium text-[13px] capitalize">
                      {team.name}
                    </span>

                    {/* Arrow */}
                    {isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </div>
                </button>

                {/* Team Items - All Direct Links */}
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {teamMenu.map((item) => (
                      <Link
                        key={item.id}
                        href={generateUrl(team.slug, item.id)}
                        className={`flex items-center gap-2 px-2 py-1 hover:bg-[#151619] rounded transition-colors ${
                          isActiveRoute(generateUrl(team.slug, item.id))
                            ? "bg-[#151619] text-blue-400"
                            : ""
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={16}
                          height={16}
                          className="opacity-80"
                        />
                        <span className="text-[13px] text-white">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamDrawer;
