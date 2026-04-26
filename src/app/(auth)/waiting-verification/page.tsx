// // src/app/(auth)/waiting-verification/page.tsx

// app/(auth)/waiting-verification/page.tsx
import { MailOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
 
import { auth } from "@/lib/auth/auth";
import { AuthHeader, AuthCard, AuthFooter } from "@/components/auth/auth-primitives";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
 
export const metadata: Metadata = { title: "في انتظار التحقق | مسجد ERP" };
 
interface WaitingPageProps {
  searchParams: Promise<{ email?: string }>;
}
 
export default async function WaitingVerificationPage({ searchParams }: WaitingPageProps) {
  const { email: queryEmail } = await searchParams;
  const session = await auth();
  const email = queryEmail ?? session?.user?.email ?? "";
 
  const steps = [
    "افتح بريدك الإلكتروني",
    "ابحث عن رسالة من مسجد ERP",
    "اضغط على زر «تأكيد البريد الإلكتروني»",
  ];
 
  return (
    <>
      {/* Icon + header */}
      <div className="mb-6 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MailOpen className="h-7 w-7 text-primary" />
        </div>
        <AuthHeader
          title="تحقق من بريدك الإلكتروني"
          description={
            email
              ? `أرسلنا رابط التحقق إلى ${email}. يرجى فتح البريد والضغط على الرابط لتفعيل حسابك.`
              : "أرسلنا رابط التحقق إلى بريدك الإلكتروني."
          }
          className="mb-0"
        />
      </div>
 
      <AuthCard className="space-y-4">
        {/* Steps */}
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground leading-6">{step}</span>
            </li>
          ))}
        </ol>
 
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            لم تصلك الرسالة؟ تحقق من مجلد البريد المزعج أو أعد الإرسال:
          </p>
          <ResendVerificationButton email={email} />
        </div>
      </AuthCard>
 
      <AuthFooter>
        <Link href="/login" className="font-medium text-primary hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </AuthFooter>
    </>
  );
}
// import { MailOpen } from "lucide-react";
// import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
// import Link from "next/link";
// import { auth } from "@/lib/auth/auth"; // adjust to your auth export path

// export const metadata = {
//   title: "في انتظار التحقق — Masjid ERP",
// };

// /**
//  * Server page shown immediately after registration.
//  * Reads the user's email from the session to pass to the resend component.
//  */
// export default async function WaitingVerificationPage({
//   searchParams,
// }: {
//   searchParams: { email?: string };
// }) {
//   const fetchedParams = await searchParams;
//   const session = await auth();
//   const email = fetchedParams.email || session?.user?.email || "";
//   // const email = session?.user?.email ?? searchParams.email ?? "";

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-sm space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2">
//           <div className="flex justify-center">
//             <div className="rounded-full bg-primary/10 p-4">
//               <MailOpen className="h-10 w-10 text-primary" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold">تحقق من بريدك الإلكتروني</h1>
//           <p className="text-sm text-muted-foreground leading-relaxed">
//             أرسلنا رابط التحقق إلى{" "}
//             {email && (
//               <span className="font-semibold text-foreground">{email}</span>
//             )}
//             . يرجى فتح البريد والضغط على الرابط لتفعيل حسابك.
//           </p>
//         </div>

//         {/* Card */}
//         <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
//           {/* Steps */}
//           <ol className="space-y-3 text-sm text-muted-foreground">
//             {[
//               "افتح بريدك الإلكتروني",
//               "ابحث عن رسالة من Masjid ERP",
//               "اضغط على زر «تأكيد البريد الإلكتروني»",
//             ].map((step, i) => (
//               <li key={i} className="flex items-start gap-3">
//                 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
//                   {i + 1}
//                 </span>
//                 <span className="leading-6">{step}</span>
//               </li>
//             ))}
//           </ol>

//           <hr className="border-border" />

//           {/* Resend section */}
//           <div className="space-y-2 text-center">
//             <p className="text-xs text-muted-foreground">
//               لم تصلك الرسالة؟ تحقق من مجلد البريد المزعج أو اضغط أدناه:
//             </p>
//             <ResendVerificationButton email={email} />
//           </div>
//         </div>

//         <p className="text-center text-sm text-muted-foreground">
//           <Link
//             href="/login"
//             className="text-primary font-medium hover:underline"
//           >
//             العودة لتسجيل الدخول
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
