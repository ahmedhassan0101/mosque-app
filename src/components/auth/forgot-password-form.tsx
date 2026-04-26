// "use client";

// /**
//  * @file components/auth/forgot-password-form.tsx
//  * @description Form for requesting a password reset email.
//  */

// import {
//   // useEffect,
//    useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import { requestPasswordReset } from "@/actions/auth.actions";

// import { Button } from "@/components/ui/button";
// import { Loader2, MailCheck } from "lucide-react";
// import { useState } from "react";
// import { FormInput } from "../form/FormInput";
// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// import {
//   type ForgotPasswordInput,
//   forgotPasswordSchema,
// } from "@/schemas/auth.schema";
// import { useCountdown } from "@/hooks/use-countdown";

// export function ForgotPasswordForm() {
//   // const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [sentEmail, setSentEmail] = useState<string | null>(null);
//   const { seconds, start, isActive } = useCountdown(60);

//   const form = useForm<ForgotPasswordInput>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: "" },
//   });

//   function onSubmit(values: ForgotPasswordInput) {
//     startTransition(async () => {
//       const result = await requestPasswordReset(values.email);

//       // Early Return on Failure
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       // Success Logic
//       toast.success(result.message);
//       setSentEmail(values.email);
//       start(60);
//     });
//   }

//   if (sentEmail) {
//     return (
//       <div className="flex flex-col items-center gap-4 py-4 text-center">
//         <MailCheck className="h-12 w-12 text-success animate-bounce" />
//         <h3 className="text-lg font-semibold">تفقد بريدك الإلكتروني</h3>
//         <p className="text-muted-foreground text-sm">
//           أرسلنا رابط استعادة كلمة المرور إلى <br />
//           <span className="font-medium text-foreground">{sentEmail}</span>
//         </p>

//         {/* زر إعادة الإرسال الموحد */}
//         <div className="w-full pt-4">
//           <Button
//             variant="outline"
//             className="w-full"
//             disabled={isActive || isPending}
//             onClick={() => onSubmit({ email: sentEmail })}
//           >
//             {isActive ? `إعادة الإرسال بعد ${seconds}ث` : "إعادة إرسال الرابط"}
//           </Button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//       <FormInput
//         control={form.control}
//         name="email"
//         label="البريد الإلكتروني"
//         type="email"
//         placeholder="admin@mosque.com"
//         dir="ltr"
//       />
//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? (
//           <>
//             <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//             جارٍ الإرسال...
//           </>
//         ) : (
//           "إرسال رابط الاستعادة"
//         )}
//       </Button>
//     </form>
//   );
// }
// app/(auth)/forgot-password/forgot-password-form.tsx
"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";
import { requestPasswordReset } from "@/actions/auth.actions";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthFooter } from "@/components/auth/auth-primitives";
import { FormInput } from "../form/FormInput";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const { seconds, start, isActive } = useCountdown(60);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setSentEmail(values.email);
      start(60);
    });
  }

  // ── Sent state ────────────────────────────────────────────────
  if (sentEmail) {
    return (
      <AuthCard className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h2 className="text-base font-semibold text-foreground mb-1">
          تفقّد بريدك الإلكتروني
        </h2>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          أرسلنا رابط الاستعادة إلى{" "}
          <span className="font-medium text-foreground" dir="ltr">
            {sentEmail}
          </span>
        </p>
        <Button
          variant="outline"
          className="w-full"
          disabled={isActive || isPending}
          onClick={() => onSubmit({ email: sentEmail })}
        >
          {isActive ? `إعادة الإرسال بعد ${seconds}ث` : "إعادة إرسال الرابط"}
        </Button>

        <AuthFooter>
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            العودة لتسجيل الدخول
          </Link>
        </AuthFooter>
      </AuthCard>
    );
  }

  // ── Default form state ────────────────────────────────────────
  return (
    <AuthCard>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormInput
          control={form.control}
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="admin@mosque.com"
          dir="ltr"
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ الإرسال...
            </>
          ) : (
            "إرسال رابط الاستعادة"
          )}
        </Button>
      </form>

      <AuthFooter>
        تذكرت كلمة المرور؟{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          تسجيل الدخول
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
