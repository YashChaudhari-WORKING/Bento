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

  const toggleTeam = (id: string) => {
    setOpenTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className=" text-white p-3 text-sm">
      {/* Header */}
      <p className="text-[#636466] flex items-center gap-1 mb-2 font-medium text-sm">
        Your teams
        <Image
          src="/icon/filled-down-arrow.png"
          alt="arrow"
          width={10}
          height={10}
          className="opacity-70"
        />
      </p>

      {/* Team List */}
      <div className="space-y-2">
        {teams.map((team) => {
          const isOpen = openTeams.includes(team._id);

          // Generate deterministic color
          const badgeColor = stringToColor(team.slug || team.name);

          // Auto pick white or black text based on brightness
          const textColor =
            getLuminance(badgeColor) > 0.5 ? "#000000" : "#FFFFFF";

          return (
            <div key={team._id}>
              {/* Team Header */}
              <button
                onClick={() => toggleTeam(team._id)}
                className="flex w-full items-center justify-between cursor-pointer px-2 py-1 hover:bg-[#151619] rounded transition-colors"
              >
                {/* Left side: badge + name */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-[5px] flex items-center justify-center text-[18px] font-bold shadow"
                    style={{
                      backgroundColor: badgeColor,
                      color: textColor,
                    }}
                  >
                    {team.slug[0].toUpperCase()}
                  </div>
                  <span className="font-medium capitalize">{team.name}</span>
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
                        width={100}
                        height={100}
                        className="opacity-80 w-4 h-4"
                      />
                      <span className="text-[#ffffff]">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDrawer;
