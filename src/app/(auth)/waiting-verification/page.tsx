// // // src/app/(auth)/waiting-verification/page.tsx

// // app/(auth)/waiting-verification/page.tsx
// import { MailOpen } from "lucide-react";
// import Link from "next/link";
// import type { Metadata } from "next";

// import { auth } from "@/lib/auth/auth";
// import {
//   AuthHeader,
//   AuthCard,
//   AuthFooter,
// } from "@/components/auth/AuthPrimitives";
// import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";

// export const metadata: Metadata = { title: "في انتظار التحقق | مسجد ERP" };

// interface WaitingPageProps {
//   searchParams: Promise<{ email?: string }>;
// }

// export default async function WaitingVerificationPage({
//   searchParams,
// }: WaitingPageProps) {
//   const { email: queryEmail } = await searchParams;
//   const session = await auth();
//   const email = queryEmail ?? session?.user?.email ?? "";

//   const steps = [
//     "افتح بريدك الإلكتروني",
//     "ابحث عن رسالة من مسجد ERP",
//     "اضغط على زر «تأكيد البريد الإلكتروني»",
//   ];

//   return (
//     <>
//       {/* Icon + header */}
//       <div className="mb-6 text-center space-y-3">
//         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//           <MailOpen className="h-7 w-7 text-primary" />
//         </div>
//         <AuthHeader
//           title="تحقق من بريدك الإلكتروني"
//           description={
//             email
//               ? `أرسلنا رابط التحقق إلى ${email}. يرجى فتح البريد والضغط على الرابط لتفعيل حسابك.`
//               : "أرسلنا رابط التحقق إلى بريدك الإلكتروني."
//           }
//           className="mb-0"
//         />
//       </div>

//       <AuthCard className="space-y-4">
//         {/* Steps */}
//         <ol className="space-y-3">
//           {steps.map((step, i) => (
//             <li key={i} className="flex items-start gap-3">
//               <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
//                 {i + 1}
//               </span>
//               <span className="text-sm text-muted-foreground leading-6">
//                 {step}
//               </span>
//             </li>
//           ))}
//         </ol>

//         <div className="border-t border-border pt-4 space-y-2">
//           <p className="text-xs text-center text-muted-foreground">
//             لم تصلك الرسالة؟ تحقق من مجلد البريد المزعج أو أعد الإرسال:
//           </p>
//           <ResendVerificationButton email={email} />
//         </div>
//       </AuthCard>

//       <AuthFooter>
//         <Link
//           href="/login"
//           className="font-medium text-primary hover:underline"
//         >
//           العودة لتسجيل الدخول
//         </Link>
//       </AuthFooter>
//     </>
//   );
// }
// src/app/(auth)/waiting-verification/page.tsx

import { MailOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { auth } from "@/lib/auth/auth";
import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";
import {
  Card,
  CardHeader,
  CardSysLabel,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "في انتظار التحقق" };

interface WaitingPageProps {
  searchParams: Promise<{ email?: string }>;
}

/*
  الصفحة دي server component — لا state، لا client code.
  البيانات: email من searchParams أو من الـ session.
  الـ ResendVerificationButton هو الجزء الوحيد الـ interactive.
*/
export default async function WaitingVerificationPage({
  searchParams,
}: WaitingPageProps) {
  const { email: queryEmail } = await searchParams;
  const session = await auth();
  const email = queryEmail ?? session?.user?.email ?? "";

  return (
    <Card className="container-auth animate-scale-in">
      {/* ── Header ─────────────────────────────────────────────── */}
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription>
            {email ? (
              <>
                أرسلنا رابط التحقق إلى{" "}
                <span dir="ltr" className="font-medium text-foreground">
                  {email}
                </span>
              </>
            ) : (
              "أرسلنا رابط التحقق إلى بريدك الإلكتروني"
            )}
          </CardDescription>
        </div>
      </CardHeader>

      {/* ── Content ────────────────────────────────────────────── */}
      <CardContent>
        <div className="flex flex-col gap-5">
          {/* Icon block */}
          <div className="flex justify-center py-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <MailOpen size={24} className="text-primary" aria-hidden="true" />
            </div>
          </div>

          {/* Steps — numbered, واضحة ومباشرة */}
          <ol className="flex flex-col gap-3">
            {[
              "افتح بريدك الإلكتروني",
              "ابحث عن رسالة من نظام إدارة المسجد",
              "اضغط على زر «تأكيد البريد الإلكتروني»",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                {/* Step number */}
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          {/* Divider */}
          <div className="divider-label">لم تصلك الرسالة؟</div>

          {/* Resend — client component معزول */}
          <ResendVerificationButton email={email} />
        </div>
      </CardContent>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </CardFooter>
    </Card>
  );
}
