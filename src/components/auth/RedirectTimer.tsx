// src/components/auth/RedirectTimer.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";

interface RedirectTimerProps {
  href: string;
  seconds?: number;
}

/*
  RedirectTimer:
  - Countdown يبدأ فور الـ mount
  - عند الوصول لـ 0 → router.push(href) تلقائياً
  - tabular-nums على الـ number عشان ما يتحركش عند التغيير
*/
export function RedirectTimer({ href, seconds = 5 }: RedirectTimerProps) {
  const router = useRouter();
  const { seconds: timeLeft, start } = useCountdown(seconds, () =>
    router.push(href)
  );

  useEffect(() => {
    start();
  }, [start]);

  return (
    <p className="rounded-md border border-border bg-muted/40 px-4 py-2.5 text-center text-xs text-muted-foreground">
      سيتم تحويلك تلقائياً خلال{" "}
      <span className="font-semibold  text-foreground">
        {timeLeft}
      </span>{" "}
      ثانية
    </p>
  );
}