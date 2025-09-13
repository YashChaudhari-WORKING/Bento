// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authCheck } from "@/redux/features/auth/authThunks";
import { setWorkspacesFromAuth } from "@/redux/features/workspace/workspaceSlice"; // ADD THIS IMPORT
import { AppDispatch, RootState } from "@/redux/store";
import LoadingSpinner from "./LoadingSpinner";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { initialized, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Only check auth on client-side if not initialized
    if (!initialized) {
      dispatch(authCheck()).then((result) => {
        // DISPATCH WORKSPACE DATA AFTER SUCCESSFUL AUTH CHECK
        if (authCheck.fulfilled.match(result)) {
          dispatch(setWorkspacesFromAuth(result.payload.memberships));
        }
      });
    }
  }, [dispatch, initialized]);

  // Show loading only if we're checking auth and not yet initialized
  if (!initialized && loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
