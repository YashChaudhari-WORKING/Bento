import React, { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import stringToColor from "string-to-color";
import { getLuminance } from "polished";
import { ChevronRight, ChevronDown } from "lucide-react";
import { selectCurrentWorkspaceTeams } from "@/redux/features/workspace/workspaceSelectors";

// Default menu
const teamMenu = [
  { id: "issues", label: "Issues", icon: "/icon/issue.png" },
  { id: "projects", label: "Projects", icon: "/icon/project.png" },
  { id: "views", label: "Views", icon: "/icon/views.png" },
];

const TeamDrawer: React.FC = () => {
  const teams = useSelector(selectCurrentWorkspaceTeams);
  const [openTeams, setOpenTeams] = useState<string[]>([]);
  const [showTeams, setShowTeams] = useState<boolean>(true);

  const toggleTeam = (id: string) => {
    setOpenTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
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

                {/* Team Items */}
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {teamMenu.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-[#151619] rounded cursor-pointer transition-colors"
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
                      </div>
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
