import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Circle,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Copy,
  AlertCircle,
  ArrowUp,
  Minus,
  ChevronDown,
} from "lucide-react";
import {
  selectIsCreateModalOpen,
  selectIssuesLoading,
} from "@/redux/features/issue/issueSelectors";
import { selectCurrentWorkspaceTeams } from "@/redux/features/workspace/workspaceSelectors";
import { closeCreateModal } from "@/redux/features/issue/issueSlice";
import { createIssue } from "@/redux/features/issue/issueThunks";
import type { CreateIssueData } from "@/redux/features/issue/issueTypes";

const statusOptions = [
  { value: "backlog", label: "Backlog", icon: Circle, shortcut: "1" },
  { value: "todo", label: "Todo", icon: Circle, shortcut: "2" },
  { value: "in_progress", label: "In Progress", icon: Play, shortcut: "3" },
  { value: "done", label: "Done", icon: CheckCircle, shortcut: "4" },
  { value: "canceled", label: "Canceled", icon: XCircle, shortcut: "5" },
  { value: "duplicate", label: "Duplicate", icon: Copy, shortcut: "6" },
];

const priorityOptions = [
  { value: "no_priority", label: "No priority", icon: Minus },
  { value: "low", label: "Low", icon: ArrowUp },
  { value: "medium", label: "Medium", icon: ArrowUp },
  { value: "high", label: "High", icon: ArrowUp },
  { value: "urgent", label: "Urgent", icon: AlertCircle },
];

const CreateIssueModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCreateModalOpen);
  const loading = useSelector(selectIssuesLoading);
  const teams = useSelector(selectCurrentWorkspaceTeams);

  const [formData, setFormData] = useState<CreateIssueData>({
    title: "",
    description: "",
    teamId: "",
    assigneeId: "",
    priority: "no_priority",
    status: "todo",
  });

  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamPopover, setShowTeamPopover] = useState(false);
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [showPriorityPopover, setShowPriorityPopover] = useState(false);

  const teamRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
      setFormData((prev) => ({ ...prev, teamId: teams[0]._id }));
    }
  }, [teams, selectedTeam]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) {
        setShowTeamPopover(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setShowStatusPopover(false);
      }
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        setShowPriorityPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    dispatch(closeCreateModal());
    setFormData({
      title: "",
      description: "",
      teamId: selectedTeam?._id || "",
      assigneeId: "",
      priority: "no_priority",
      status: "todo",
    });
    setShowTeamPopover(false);
    setShowStatusPopover(false);
    setShowPriorityPopover(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.teamId) return;

    try {
      // @ts-ignore
      await dispatch(createIssue(formData)).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const handleTeamSelect = (team: any) => {
    setSelectedTeam(team);
    setFormData((prev) => ({ ...prev, teamId: team._id }));
    setShowTeamPopover(false);
  };

  const handleStatusSelect = (status: string) => {
    setFormData((prev) => ({ ...prev, status: status as any }));
    setShowStatusPopover(false);
  };

  const handlePrioritySelect = (priority: string) => {
    setFormData((prev) => ({ ...prev, priority: priority as any }));
    setShowPriorityPopover(false);
  };

  const getCurrentStatus = () =>
    statusOptions.find((s) => s.value === formData.status) || statusOptions[1];
  const getCurrentPriority = () =>
    priorityOptions.find((p) => p.value === formData.priority) ||
    priorityOptions[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-[#2a2d31] rounded-lg w-full max-w-2xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e4042]">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
              onClick={() => setShowTeamPopover(!showTeamPopover)}
            >
              <span className="text-white text-xs font-bold">
                {selectedTeam?.slug?.[0]?.toUpperCase() || "T"}
              </span>
            </div>
            <span className="text-white font-medium">New Issue</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Team Selection Popover */}
        {showTeamPopover && (
          <div ref={teamRef} className="border-b border-[#3e4042] bg-[#25272a]">
            <div className="p-4 space-y-2">
              {teams &&
                teams.map((team) => (
                  <div
                    key={team._id}
                    onClick={() => handleTeamSelect(team)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                      selectedTeam?._id === team._id
                        ? "bg-purple-600 text-white"
                        : "hover:bg-[#3a3b3c] text-gray-300"
                    }`}
                  >
                    <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {team.slug[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{team.name}</div>
                      <div className="text-xs text-gray-400">{team.slug}</div>
                    </div>
                    {selectedTeam?._id === team._id && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Issue title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full bg-transparent text-white text-lg placeholder-gray-400 border-none outline-none"
              autoFocus
              required
            />

            <textarea
              placeholder="Add description..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full bg-transparent text-gray-300 placeholder-gray-500 border-none outline-none resize-none h-20"
            />
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between p-4 border-t border-[#3e4042]">
            <div className="flex items-center gap-3">
              {/* Status Selector */}
              <div className="relative" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => setShowStatusPopover(!showStatusPopover)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#3a3b3c] text-white text-sm rounded hover:bg-[#4a4b4c] transition-colors"
                >
                  {/* <getCurrentStatus().icon size={12} className="text-gray-400" /> */}
                  <span>{getCurrentStatus().label}</span>
                </button>

                {/* Status Popover */}
                {showStatusPopover && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#25272a] border border-[#3e4042] rounded-lg shadow-xl z-50">
                    <div className="p-2">
                      <div className="text-xs text-gray-400 px-2 py-1 mb-1 border-b border-[#3e4042]">
                        Change status...
                        <span className="ml-2 text-[10px]">S</span>
                      </div>
                      <div className="space-y-1 mt-2">
                        {statusOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleStatusSelect(option.value)}
                            className="flex items-center gap-3 px-2 py-1.5 hover:bg-[#3a3b3c] rounded cursor-pointer text-sm transition-colors"
                          >
                            <option.icon size={14} className="text-gray-400" />
                            <span className="text-white flex-1">
                              {option.label}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {option.shortcut}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Selector */}
              <div className="relative" ref={priorityRef}>
                <button
                  type="button"
                  onClick={() => setShowPriorityPopover(!showPriorityPopover)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#3a3b3c] text-gray-300 text-sm rounded hover:bg-[#4a4b4c] transition-colors"
                >
                  {/* <getCurrentPriority().icon size={12} className="text-gray-400" /> */}
                  <span>{getCurrentPriority().label}</span>
                </button>

                {/* Priority Popover */}
                {showPriorityPopover && (
                  <div className="absolute bottom-full left-0 mb-2 w-40 bg-[#25272a] border border-[#3e4042] rounded-lg shadow-xl z-50">
                    <div className="p-2 space-y-1">
                      {priorityOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => handlePrioritySelect(option.value)}
                          className="flex items-center gap-3 px-2 py-1.5 hover:bg-[#3a3b3c] rounded cursor-pointer text-sm transition-colors"
                        >
                          <option.icon size={14} className="text-gray-400" />
                          <span className="text-white">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div className="px-3 py-1.5 bg-[#3a3b3c] text-gray-300 text-sm rounded">
                Unassigned
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.title.trim() || loading.create}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.create ? "Creating..." : "Create issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueModal;
