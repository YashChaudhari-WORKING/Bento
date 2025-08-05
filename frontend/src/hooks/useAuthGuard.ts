// hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useAuthGuard = (redirectTo: string = "/auth/login") => {
  const { isAuthenticated, initialized } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, initialized, router, redirectTo]);

  return { isAuthenticated, initialized };
};
