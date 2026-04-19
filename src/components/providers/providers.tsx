"use client";

/**
 * @file providers.tsx
 * @description Thin Client Component wrapper for all context providers.
 * Placing providers here prevents the root layout from becoming a Client Component.
 * Add future providers (ThemeProvider, QueryClientProvider, etc.) here.
 */

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  /** Pre-fetched session from the Server Component layout for instant hydration. */
  session?: Session | null;
}

/**
 * Root providers wrapper. Keep this list minimal — only global context goes here.
 */
export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
}
