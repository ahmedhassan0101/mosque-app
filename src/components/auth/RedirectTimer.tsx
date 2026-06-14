// components/auth/redirect-timer.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";

interface RedirectTimerProps {
  href: string;
  seconds?: number;
}

export function RedirectTimer({ href, seconds = 5 }: RedirectTimerProps) {
  const router = useRouter();
  const { seconds: timeLeft, start } = useCountdown(seconds, () =>
    router.push(href),
  );

  useEffect(() => {
    start();
  }, [start]);

  return (
    <p className="rounded-lg bg-muted px-4 py-2.5 text-center text-xs text-muted-foreground">
      سيتم تحويلك تلقائياً خلال{" "}
      <span className="font-bold tabular-nums text-primary">{timeLeft}</span>{" "}
      ثانية
    </p>
  );
}
