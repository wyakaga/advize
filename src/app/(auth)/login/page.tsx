"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { BarChart3 } from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="card w-full max-w-md text-center">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--color-coral)" }}
          >
            <BarChart3 size={28} color="white" strokeWidth={1.5} />
          </div>
          <h1
            className="text-2xl font-bold font-jkt"
            style={{ color: "var(--color-text-primary)" }}
          >
            AdVize
          </h1>
          <p className="text-label">AI-powered ads optimization advisor</p>
        </div>

        <div
          className="my-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        />

        <p
          className="text-body mb-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Sign in to analyze your ad campaigns, discover underperforming areas,
          and get actionable optimization suggestions.
        </p>

        {/* Google Sign In */}
        <button
          className="btn-primary w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          id="login-google-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </button>

        <p className="text-label mt-4">
          We only use your Google account to sign you in. No data is shared.
        </p>
      </div>
    </div>
  );
}
