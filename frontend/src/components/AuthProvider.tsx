// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authCheck } from "@/redux/features/auth/authThunks";
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
      dispatch(authCheck());
    }
  }, [dispatch, initialized]);

  // Show loading only if we're checking auth and not yet initialized
  if (!initialized && loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
