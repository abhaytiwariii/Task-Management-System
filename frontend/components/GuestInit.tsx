"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function GuestInit() {
  const initializeGuest = useAuthStore((state) => state.initializeGuest);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated) {
      initializeGuest();
    }
  }, [isHydrated, initializeGuest]);

  return null;
}
