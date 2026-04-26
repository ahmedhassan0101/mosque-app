// app/(auth)/verify-email/page.tsx
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { verifyEmailToken } from "@/actions/auth.actions";
import { RedirectTimer } from "@/components/auth/redirect-timer";
import { AuthCard } from "@/components/auth/auth-primitives";

export const metadata: Metadata = {
  title: "تأكيد البريد الإلكتروني | مسجد ERP",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token, email } = await searchParams;

  // ── No token ──────────────────────────────────────────────────
  if (!token) {
    return (
      <StatusCard
        icon={<XCircle className="h-8 w-8 text-destructive" />}
        iconBg="bg-destructive/10"
        title="رابط غير صالح"
        description="لم يتم العثور على رمز التحقق. يرجى التأكد من الرابط أو طلب رسالة جديدة."
        action={
          <PrimaryLink href={`/waiting-verification?email=${email ?? ""}`}>
            إعادة إرسال رسالة التحقق
          </PrimaryLink>
        }
      />
    );
  }

  const result = await verifyEmailToken(token);

  // ── Expired / Failed ──────────────────────────────────────────
  if (result.status !== "success") {
    return (
      <StatusCard
        icon={<Clock className="h-8 w-8 text-warning" />}
        iconBg="bg-warning/10"
        title="انتهت صلاحية الرابط"
        description={result.message}
        action={
          <PrimaryLink href={`/waiting-verification?email=${email ?? ""}`}>
            طلب رابط جديد
          </PrimaryLink>
        }
      />
    );
  }

  // ── Success ───────────────────────────────────────────────────
  return (
    <StatusCard
      icon={<CheckCircle2 className="h-8 w-8 text-success" />}
      iconBg="bg-success/10"
      title="تم تأكيد بريدك الإلكتروني"
      description={result.message}
      action={
        <div className="w-full space-y-3">
          <PrimaryLink href="/login?verified=true">
            تسجيل الدخول الآن
          </PrimaryLink>
          <RedirectTimer href="/login?verified=true" seconds={8} />
        </div>
      }
    />
  );
}

// ── Sub-components ─────────────────────────────────────────────

interface StatusCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description?: string;
  action: React.ReactNode;
}

function StatusCard({
  icon,
  iconBg,
  title,
  description,
  action,
}: StatusCardProps) {
  return (
    <AuthCard className="text-center space-y-4">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <div className="space-y-1.5">
        <h1 className="text-base font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="pt-1">{action}</div>
    </AuthCard>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        block w-full rounded-lg bg-primary px-4 py-2.5
        text-center text-sm font-semibold text-primary-foreground
        transition-opacity hover:opacity-90
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >
      {children}
    </Link>
  );
}

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
