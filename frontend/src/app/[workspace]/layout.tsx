// app/[workspace]/layout.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { setCurrentWorkspace } from "@/redux/features/workspace/workspaceSlice";
import { closeSidebar } from "@/redux/features/layout/sidebarSlice";
import AuthProvider from "@/components/AuthProvider";
import InnovativeSidebar from "@/components/layout/InnovativeSidebar";
import { useMemberships } from "@/hooks/useMemberships";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { findMembershipBySlug, initialized } = useMemberships();
  const { isOpen, isPinned } = useSelector((state: RootState) => state.sidebar);
  const params = useParams();
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    if (!initialized || !workspaceSlug) return;

    try {
      const currentMembership = findMembershipBySlug(workspaceSlug);

      if (currentMembership) {
        dispatch(setCurrentWorkspace(currentMembership.workspace));
      } else {
        console.warn(`No membership found for workspace: ${workspaceSlug}`);
      }
    } catch (error) {
      console.error("Error setting current workspace:", error);
    }
  }, [dispatch, findMembershipBySlug, workspaceSlug, initialized]);

  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <InnovativeSidebar />

        {/* Overlay for mobile when sidebar is open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => dispatch(closeSidebar())}
          />
        )}

        {/* Main content area */}
        <div
          className={`transition-all duration-300 ${
            isPinned ? "md:ml-64" : "ml-0"
          }`}
        >
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
