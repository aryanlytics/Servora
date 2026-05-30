"use client";

import { useAuthStore } from "@/lib/store";

export function useAuth() {
  const { accessToken, refreshToken, user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
}
