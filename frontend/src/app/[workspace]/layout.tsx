// app/[workspace]/layout.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { setCurrentWorkspace } from "@/redux/features/auth/authSlice";
import { closeSidebar } from "@/redux/features/layout/sidebarSlice";
import AuthProvider from "@/components/AuthProvider";
import InnovativeSidebar from "@/components/layout/InnovativeSidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { memberships, initialized } = useSelector(
    (state: RootState) => state.auth
  );
  const { isOpen, isPinned } = useSelector((state: RootState) => state.sidebar);
  const params = useParams();
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    if (initialized && memberships.length > 0 && workspaceSlug) {
      const currentMembership = memberships.find(
        (m) => m.workspace.slug === workspaceSlug
      );
      if (currentMembership) {
        dispatch(setCurrentWorkspace(currentMembership.workspace));
      }
    }
  }, [dispatch, memberships, workspaceSlug, initialized]);

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
            isPinned ? "md:ml-72" : "ml-0"
          }`}
        >
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
