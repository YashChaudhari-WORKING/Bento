// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Inbox,
  User2,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({ workspace, teams }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const isActive = (path) => pathname === path;

  const base = `/${workspace}`;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        <Menu className="text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform transition-transform fixed z-40 md:static bg-gray-900 text-white w-64 h-screen p-4 overflow-y-auto`}
      >
        <h2 className="text-lg font-bold mb-6">{workspace}</h2>

        {/* Global */}
        <div className="space-y-2 text-sm mb-6">
          <SidebarItem
            href={`${base}/inbox`}
            icon={<Inbox size={18} />}
            label="Inbox"
            active={isActive(`${base}/inbox`)}
          />
          <SidebarItem
            href={`${base}/my-issues`}
            icon={<User2 size={18} />}
            label="My Issues"
            active={isActive(`${base}/my-issues`)}
          />
        </div>

        {/* Workspace */}
        <div className="space-y-2 text-sm mb-6">
          <div className="text-xs text-gray-400 mb-1">Workspace</div>
          <SidebarItem
            href={`${base}/projects`}
            icon={<FolderKanban size={18} />}
            label="Projects"
            active={isActive(`${base}/projects`)}
          />
          <SidebarItem
            href={`${base}/views`}
            icon={<Layers size={18} />}
            label="Views"
            active={isActive(`${base}/views`)}
          />
        </div>

        {/* Teams */}
        <div className="space-y-3 text-sm">
          <div className="text-xs text-gray-400 mb-1">Your Teams</div>
          {teams?.map((team) => (
            <div key={team.slug}>
              <SidebarItem
                href={`${base}/team/${team.slug}/issues`}
                icon={<LayoutDashboard size={18} />}
                label={team.name}
                active={pathname.includes(`/team/${team.slug}`)}
              />
              <div className="ml-4 text-sm space-y-1 mt-1">
                <SidebarItem
                  href={`${base}/team/${team.slug}/issues`}
                  label="Issues"
                  active={pathname === `${base}/team/${team.slug}/issues`}
                />
                <SidebarItem
                  href={`${base}/team/${team.slug}/projects`}
                  label="Projects"
                  active={pathname === `${base}/team/${team.slug}/projects`}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700 ${
        active ? "bg-gray-700 font-semibold" : "text-gray-300"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
