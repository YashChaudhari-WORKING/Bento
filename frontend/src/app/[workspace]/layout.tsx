// app/[workspace]/layout.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, usePathname } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { setCurrentWorkspace } from "@/redux/features/workspace/workspaceSlice";
import { closeSidebar } from "@/redux/features/layout/sidebarSlice";
import AuthProvider from "@/components/AuthProvider";
import Sidebar from "@/components/layout/Sidebar";
import { useMemberships } from "@/hooks/useMemberships";
import CreateIssueModal from "@/components/issues/CreateIssueModal";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { findMembershipBySlug, initialized } = useMemberships();
  const { isOpen, isPinned } = useSelector((state: RootState) => state.sidebar);
  const params = useParams();
  const pathname = usePathname();
  const workspaceSlug = params.workspace as string;
  const isSettingsPage = pathname.includes("/settings");

  useEffect(() => {
    if (!initialized || !workspaceSlug) return;

    const currentMembership = findMembershipBySlug(workspaceSlug);

    if (currentMembership) {
      dispatch(setCurrentWorkspace(currentMembership.workspace));
    }
  }, [dispatch, findMembershipBySlug, workspaceSlug, initialized]);

  if (!workspaceSlug) return null;

  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <Sidebar menuType={isSettingsPage ? "settings" : "default"} />

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => dispatch(closeSidebar())}
          />
        )}

        <div
          className={`transition-all duration-300 ${
            isPinned ? "md:ml-64" : "ml-0"
          }`}
        >
          <main className="min-h-screen">{children}</main>
        </div>
      </div>

      <CreateIssueModal />
    </AuthProvider>
  );
}
