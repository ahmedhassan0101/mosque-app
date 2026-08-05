// src/components/auth/ResendVerificationButton.tsx
"use client";

import { useTransition, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/actions/auth.actions";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { seconds, start, isActive } = useCountdown(60);

  useEffect(() => {
    start();
  }, [start]);

  function handleResend() {
    if (!email) {
      toast.error("البريد الإلكتروني غير موجود");
      return;
    }

    startTransition(async () => {
      const result = await resendVerificationEmail(email);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      start(60);
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      disabled={isActive || isPending}
      onClick={handleResend}
    >
      {isPending && "جارٍ الإرسال..."}
      {!isPending && isActive && (
        <>
          <RefreshCcw size={14} aria-hidden="true" />
          إعادة الإرسال بعد {seconds} ثانية
        </>
      )}
      {!isPending && !isActive && (
        <>
          <RefreshCcw size={14} aria-hidden="true" />
          إعادة إرسال رسالة التحقق
        </>
      )}
    </Button>
  );
}
