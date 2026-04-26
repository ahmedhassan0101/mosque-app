// "use client";

// /**
//  * @file components/auth/resend-verification-button.tsx
//  * @description Client Component with a 60-second countdown timer
//  * that lets the user resend their verification email.
//  */

// import { useEffect, useState, useTransition } from "react";
// import { toast } from "sonner";
// import { Loader2, RefreshCcw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { resendVerificationEmail } from "@/actions/auth.actions";
// import { useCountdown } from "@/hooks/use-countdown";
// // import { resendVerificationEmail } from "@/actions/email-verify.actions";

// const COOLDOWN_SECONDS = 60;

// interface ResendVerificationButtonProps {
//   /** The user's email address — passed from the Server Component via session */
//   email: string;
// }

// export function ResendVerificationButton({
//   email,
// }: ResendVerificationButtonProps) {
//   const [isPending, startTransition] = useTransition();
//   // const [countdown, setCountdown] = useState(0);

//   const { seconds, start, isActive } = useCountdown(60);

//   useEffect(() => {
//     start();
//   }, [start]);

//   // Decrement countdown every second
//   // useEffect(() => {
//   //   if (countdown <= 0) return;

//   //   const timer = setInterval(() => {
//   //     setCountdown((prev) => prev - 1);
//   //   }, 1000);

//   //   return () => clearInterval(timer);
//   // }, [countdown]);

//   // const isDisabled = isPending || countdown > 0;

//   function handleResend() {
//     if (!email) {
//       toast.error("البريد الإلكتروني غير موجود");
//       return;
//     }

//     startTransition(async () => {
//       const result = await resendVerificationEmail(email);

//       // Early return on failure
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       // Success: start the cooldown
//       toast.success(result.message);
//       start(60);
//       // setCountdown(COOLDOWN_SECONDS);
//     });
//   }

//   return (
//     <Button
//       type="button"
//       variant="outline"
//       className="w-full"
//       disabled={isActive || isPending}
//       onClick={handleResend}
//     >
//       {isPending ? (
//         <>
//           <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//           جارٍ الإرسال...
//         </>
//       ) : isActive ? (
//         <>
//           <RefreshCcw className="ml-2 h-4 w-4" />
//           إعادة الإرسال بعد {seconds}ث
//         </>
//       ) : (
//         <>
//           <RefreshCcw className="ml-2 h-4 w-4" />
//           إعادة إرسال رسالة التحقق
//         </>
//       )}
//     </Button>
//   );
// }

// components/auth/resend-verification-button.tsx
"use client";

import { useTransition, useEffect } from "react";
import { RefreshCcw, Loader2 } from "lucide-react";
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

  // Start cooldown immediately on mount so user can't spam on page load
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
      variant="outline"
      className="w-full"
      disabled={isActive || isPending}
      onClick={handleResend}
    >
      {isPending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          جارٍ الإرسال...
        </>
      ) : isActive ? (
        <>
          <RefreshCcw className="h-3.5 w-3.5" />
          إعادة الإرسال بعد {seconds}ث
        </>
      ) : (
        <>
          <RefreshCcw className="h-3.5 w-3.5" />
          إعادة إرسال رسالة التحقق
        </>
      )}
    </Button>
  );
}
