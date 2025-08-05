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
import {
  Home,
  Users,
  Calendar,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  Star,
  Clock,
  Filter,
  Zap,
  Target,
  User,
} from "lucide-react";

const InnovativeSidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const isPinned = useSelector((state: RootState) => state.sidebar.isPinned);
  const activeItem = useSelector(
    (state: RootState) => state.sidebar.activeItem
  );
  const hasSeenHint = useSelector(
    (state: RootState) => state.sidebar.hasSeenHint
  );

  const [hoverZone, setHoverZone] = useState(false);
  const [gestureHint, setGestureHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!hasSeenHint && !isMobile) {
      setTimeout(() => setGestureHint(true), 2000);
      setTimeout(() => {
        setGestureHint(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("sidebar-hint-seen", "true");
        }
        dispatch(setSeenHint());
      }, 5000);
    }
  }, [hasSeenHint, isMobile, dispatch]);

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

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", badge: null },
    { id: "teams", icon: Users, label: "Teams", badge: 3 },
    { id: "calendar", icon: Calendar, label: "Calendar", badge: null },
    { id: "notifications", icon: Bell, label: "Notifications", badge: 12 },
    { id: "search", icon: Search, label: "Search", badge: null },
  ];

  const quickActions = [
    { id: "recent", icon: Clock, label: "Recent Items" },
    { id: "favorites", icon: Star, label: "Favorites" },
    { id: "filters", icon: Filter, label: "My Filters" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800"
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
        className={`fixed left-0 top-0 h-full w-72 bg-slate-900 text-white transition-transform duration-300 z-40 shadow-2xl ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isOpen || isPinned
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg">Workspace</span>
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

        {/* Create button */}
        <div className="p-4">
          <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Issue</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => dispatch(setActiveItem(id))}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                activeItem === id
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30"
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{label}</span>
              {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Access */}
        <div className="p-4 border-t border-slate-700">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickActions.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InnovativeSidebar;
