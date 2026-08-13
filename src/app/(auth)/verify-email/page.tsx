// src/app/(auth)/verify-email/page.tsx

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { verifyEmailToken } from "@/actions/auth.actions";
import { RedirectTimer } from "@/components/auth/RedirectTimer";
import {
  Card,
  CardHeader,
  CardSysLabel,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "تأكيد البريد الإلكتروني" };

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

/*
  Server component — يعمل الـ verification مباشرة على الـ server.
  3 states مستقلة: no-token / failed / success.
  كل state ليها section واضحة — لا abstraction مشترك.
*/
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token, email } = await searchParams;

  // ── State 1: لا يوجد token ─────────────────────────────────────
  if (!token) {
    return (
      <Card className="container-auth animate-scale-in">
        <CardHeader>
          <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
          <div className="flex flex-col gap-1 pt-2">
            <CardTitle>رابط غير صالح</CardTitle>
            <CardDescription>
              لم يتم العثور على رمز التحقق في الرابط
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-4">
              <XCircle
                size={18}
                className="shrink-0 text-destructive"
                aria-hidden="true"
              />
              <p className="text-sm text-destructive leading-relaxed">
                الرابط الذي استخدمته غير مكتمل أو غير صحيح. تأكد من نسخ الرابط
                كاملاً من الإيميل.
              </p>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/waiting-verification?email=${email ?? ""}`}>
                إعادة إرسال رسالة التحقق
              </Link>
            </Button>
          </div>
        </CardContent>

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

  // ── Server action — يتنفذ مرة واحدة على الـ server ────────────
  const result = await verifyEmailToken(token);

  // ── State 2: Token منتهي الصلاحية أو فاشل ─────────────────────
  if (result.status !== "success") {
    return (
      <Card className="container-auth animate-scale-in">
        <CardHeader>
          <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
          <div className="flex flex-col gap-1 pt-2">
            <CardTitle>انتهت صلاحية الرابط</CardTitle>
            <CardDescription>
              روابط التحقق صالحة لمدة 24 ساعة فقط
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-md border border-warning/20 bg-warning/5 p-4">
              <Clock
                size={18}
                className="shrink-0 text-warning"
                aria-hidden="true"
              />
              <p className="text-sm text-warning leading-relaxed">
                {result.message}
              </p>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/waiting-verification?email=${email ?? ""}`}>
                طلب رابط جديد
              </Link>
            </Button>
          </div>
        </CardContent>

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

  // ── State 3: Success ───────────────────────────────────────────
  return (
    <Card className="container-auth animate-scale-in">
      <CardHeader>
        <CardSysLabel>نظام إدارة المسجد</CardSysLabel>
        <div className="flex flex-col gap-1 pt-2">
          <CardTitle>تم تأكيد بريدك الإلكتروني</CardTitle>
          <CardDescription>
            حسابك الآن مفعّل ويمكنك البدء في استخدام النظام
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 rounded-md border border-success/20 bg-success/5 p-4">
            <CheckCircle2
              size={18}
              className="shrink-0 text-success"
              aria-hidden="true"
            />
            <p className="text-sm text-success leading-relaxed">
              {result.message}
            </p>
          </div>

          {/* Redirect تلقائي + زرار للي مش عايز ينتظر */}
          <RedirectTimer href="/login?verified=true" seconds={5} />

          <Button className="w-full" asChild>
            <Link href="/login?verified=true">تسجيل الدخول الآن</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
// // app/(auth)/verify-email/page.tsx
// import { CheckCircle2, Clock, XCircle } from "lucide-react";
// import Link from "next/link";
// import type { Metadata } from "next";

// import { verifyEmailToken } from "@/actions/auth.actions";
// import { RedirectTimer } from "@/components/auth/RedirectTimer";
// import { AuthCard } from "@/components/auth/AuthPrimitives";

// export const metadata: Metadata = {
//   title: "تأكيد البريد الإلكتروني | مسجد ERP",
// };

// interface VerifyEmailPageProps {
//   searchParams: Promise<{ token?: string; email?: string }>;
// }

// export default async function VerifyEmailPage({
//   searchParams,
// }: VerifyEmailPageProps) {
//   const { token, email } = await searchParams;

//   // ── No token ──────────────────────────────────────────────────
//   if (!token) {
//     return (
//       <StatusCard
//         icon={<XCircle className="h-8 w-8 text-destructive" />}
//         iconBg="bg-destructive/10"
//         title="رابط غير صالح"
//         description="لم يتم العثور على رمز التحقق. يرجى التأكد من الرابط أو طلب رسالة جديدة."
//         action={
//           <PrimaryLink href={`/waiting-verification?email=${email ?? ""}`}>
//             إعادة إرسال رسالة التحقق
//           </PrimaryLink>
//         }
//       />
//     );
//   }

//   const result = await verifyEmailToken(token);

//   // ── Expired / Failed ──────────────────────────────────────────
//   if (result.status !== "success") {
//     return (
//       <StatusCard
//         icon={<Clock className="h-8 w-8 text-warning" />}
//         iconBg="bg-warning/10"
//         title="انتهت صلاحية الرابط"
//         description={result.message}
//         action={
//           <PrimaryLink href={`/waiting-verification?email=${email ?? ""}`}>
//             طلب رابط جديد
//           </PrimaryLink>
//         }
//       />
//     );
//   }

//   // ── Success ───────────────────────────────────────────────────
//   return (
//     <StatusCard
//       icon={<CheckCircle2 className="h-8 w-8 text-success" />}
//       iconBg="bg-success/10"
//       title="تم تأكيد بريدك الإلكتروني"
//       description={result.message}
//       action={
//         <div className="w-full space-y-3">
//           <PrimaryLink href="/login?verified=true">
//             تسجيل الدخول الآن
//           </PrimaryLink>
//           <RedirectTimer href="/login?verified=true" seconds={8} />
//         </div>
//       }
//     />
//   );
// }

// // ── Sub-components ─────────────────────────────────────────────

// interface StatusCardProps {
//   icon: React.ReactNode;
//   iconBg: string;
//   title: string;
//   description?: string;
//   action: React.ReactNode;
// }

// function StatusCard({
//   icon,
//   iconBg,
//   title,
//   description,
//   action,
// }: StatusCardProps) {
//   return (
//     <AuthCard className="text-center space-y-4">
//       <div
//         className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
//       >
//         {icon}
//       </div>
//       <div className="space-y-1.5">
//         <h1 className="text-base font-bold text-foreground">{title}</h1>
//         {description && (
//           <p className="text-sm text-muted-foreground leading-relaxed">
//             {description}
//           </p>
//         )}
//       </div>
//       <div className="pt-1">{action}</div>
//     </AuthCard>
//   );
// }

// function PrimaryLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="
//         block w-full rounded-lg bg-primary px-4 py-2.5
//         text-center text-sm font-semibold text-primary-foreground
//         transition-opacity hover:opacity-90
//         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//       "
//     >
//       {children}
//     </Link>
//   );
// }

// import { verifyEmailToken } from "@/actions/auth.actions";
// import { RedirectTimer } from "@/components/auth/redirect-timer";
// import { CheckCircle2, XCircle, Clock } from "lucide-react";
// import Link from "next/link";

// export const metadata = {
//   title: "تأكيد البريد الإلكتروني — Masjid ERP",
// };

// interface VerifyEmailPageProps {
//   searchParams: Promise<{ token?: string; email?: string }>;
// }

// /**
//  * Server page that handles email verification.
//  * Reads token from URL, calls the verify action, and renders appropriate UI.
//  */
// export default async function VerifyEmailPage({
//   searchParams,
// }: VerifyEmailPageProps) {
//   const { token, email } = await searchParams;

//   // ── No token in URL ───────────────────────────────────────────────────────
//   if (!token) {
//     return (
//       <VerifyLayout>
//         <StatusCard
//           icon={<XCircle className="h-14 w-14 text-destructive" />}
//           title="رابط غير صالح"
//           description="لم يتم العثور على رمز التحقق في الرابط. يرجى التأكد من الرابط أو طلب إرسال رسالة جديدة."
//           action={
//             <Link
//               href={`/waiting-verification?email=${email}`}
//               className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
//             >
//               إعادة إرسال رسالة التحقق
//             </Link>
//           }
//         />
//       </VerifyLayout>
//     );
//   }

//   // ── Trigger verification action ───────────────────────────────────────────
//   const result = await verifyEmailToken(token);

//   // ── Failed / Expired ──────────────────────────────────────────────────────
//   if (result.status !== "success") {
//     return (
//       <VerifyLayout>
//         <StatusCard
//           icon={<Clock className="h-14 w-14 text-warning" />}
//           title="انتهت صلاحية الرابط"
//           description={result.message}
//           action={
//             <Link
//               href={`/waiting-verification?email=${email}`}
//               className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
//             >
//               طلب رابط جديد
//             </Link>
//           }
//         />
//       </VerifyLayout>
//     );
//   }

//   // ── Success ────────────────────────────────────────────────────────────────
//   return (
//     <VerifyLayout>
//       <StatusCard
//         icon={
//           <CheckCircle2 className="h-14 w-14 text-success animate-bounce" />
//         }
//         title="تم تأكيد بريدك الإلكتروني! 🎉"
//         description={result.message}
//         action={
//           <div className="space-y-4">
//             <Link
//               href="/login?verified=true"
//               className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 w-full"
//             >
//               تسجيل الدخول الآن
//             </Link>
//             {/* إضافة العداد هنا */}
//             <RedirectTimer href="/login?verified=true" seconds={8} />
//           </div>
//         }
//       />
//     </VerifyLayout>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function VerifyLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-sm">{children}</div>
//     </div>
//   );
// }

// interface StatusCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description?: string;
//   action: React.ReactNode;
// }

// function StatusCard({ icon, title, description, action }: StatusCardProps) {
//   return (
//     <div className="rounded-xl border bg-card p-8 shadow-sm text-center space-y-5">
//       <div className="flex justify-center">{icon}</div>
//       <div className="space-y-2">
//         <h1 className="text-xl font-bold text-card-foreground">{title}</h1>
//         <p className="text-sm text-muted-foreground leading-relaxed">
//           {description}
//         </p>
//       </div>
//       <div className="pt-2">{action}</div>
//     </div>
//   );
// }
