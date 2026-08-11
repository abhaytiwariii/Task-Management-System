"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function PyramidMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-[7px] bg-primary text-primary-foreground" aria-hidden="true">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3.5 3.75 18.2 12 21l8.25-2.8L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 3.5v17.2M3.75 18.2h16.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.08H12v3.94h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.39Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.38l-3.22-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.59A9.98 9.98 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.94A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.94V7.47H3.06A10 10 0 0 0 2 12c0 1.63.39 3.17 1.06 4.53l3.33-2.59Z" />
      <path fill="#EA4335" d="M12 5.93c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.95 2.93 14.7 2 12 2a9.98 9.98 0 0 0-8.94 5.47l3.33 2.59C7.18 7.69 9.39 5.93 12 5.93Z" />
    </svg>
  );
}

export function AuthCard() {
  const [status, setStatus] = useState<string | null>(null);
  const { initializeGuest } = useAuthStore();
  const router = useRouter();

  const handleGuestLogin = async () => {
    setStatus("Continuing as a guest…");
    try {
      await initializeGuest();
      router.push("/");
    } catch (error) {
      console.error(error);
      setStatus("Failed to login as guest");
    }
  };

  const handleGoogleLogin = async () => {
    setStatus("Redirecting to Google…");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setStatus("Failed to login with Google");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 font-sans text-foreground">
      <div className="flex w-full max-w-[525px] flex-col items-center">
        <div className="mb-7 flex items-center gap-2.5">
          <PyramidMark />
          <span className="text-[19px] font-bold tracking-[-0.02em]">Pyramid</span>
        </div>

        <section className="w-full rounded-[19px] border border-border bg-card px-6 py-9 shadow-[0_2px_4px_rgb(0_0_0/0.08)] sm:px-9 sm:py-10" aria-labelledby="auth-title">
          <div className="text-center">
            <h1 id="auth-title" className="text-[22px] font-bold leading-tight tracking-[-0.025em]">Let&apos;s get back on track</h1>
            <p className="mt-2.5 text-[17px] leading-6 text-muted-foreground">Enter your email below to login to your account.</p>
          </div>

          <div className="mt-6 space-y-2.5">
            <button 
              type="button" 
              onClick={handleGuestLogin} 
              className="flex h-[50px] w-full items-center justify-center rounded-full bg-primary px-5 text-[17px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
            >
              Continue as Guest
            </button>
            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-border bg-card px-5 text-[17px] font-medium text-card-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
            >
              <GoogleMark />
              Login with Google
            </button>
          </div>
          {status && <p className="sr-only" role="status">{status}</p>}
        </section>

        <p className="mt-5 max-w-[235px] text-center text-[14px] leading-[23px] text-muted-foreground">
          By clicking continue, you agree to our <a href="#terms" className="underline underline-offset-2 hover:text-foreground">Terms of Service</a> and <a href="#privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</a>
        </p>
      </div>
    </main>
  );
}

export default AuthCard;
