"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../../store/useAuthStore";
import { api } from "../../../lib/api";

export default function AuthCallback() {
  const router = useRouter();
  const setUserId = useAuthStore((state) => state.setUserId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) throw new Error("No session found");

        const user = session.user;
        
        // Sync with NestJS backend
        const response = await api.post("/auth/sync", {
          email: user.email,
          googleId: user.id, // Supabase Auth user ID
          name: user.user_metadata?.full_name,
        });

        // Backend will return the NestJS PostgreSQL user ID
        setUserId(response.data.id);
        router.push("/");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to authenticate";
        console.error("Auth callback error:", err);
        setError(errorMessage);
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [router, setUserId]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground font-medium animate-pulse">Completing authentication...</p>
      </div>
    </div>
  );
}
