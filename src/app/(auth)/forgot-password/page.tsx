/**
 * @file app/(auth)/forgot-password/page.tsx
 * @description Server Component page for the forgot password flow.
 */

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";

export const metadata = {
  title: "استعادة كلمة المرور — Masjid ERP",
};

export default function ForgotPasswordPage() {
  console.log("[ForgotPasswordPage] Rendering forgot password page");
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">نسيت كلمة المرور؟</h1>
          <p className="text-muted-foreground text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          تذكرت كلمة المرور؟{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Loader2, CheckCircle2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { FormInput } from "@/components/form/FormInput";
// import {
//   forgotPasswordSchema,
//   ForgotPasswordForm,
//   sendForgotPassword,
// } from "@/hooks/mutations/useAuth";

// export default function ForgotPasswordPage() {
//   const [done, setDone] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { control, handleSubmit } = useForm<ForgotPasswordForm>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: "" },
//   });

//   const onSubmit = async (data: ForgotPasswordForm) => {
//     setLoading(true);
//     const error = await sendForgotPassword(data);
//     setLoading(false);
//     if (error) {
//       toast.error(error);
//       return;
//     }
//     setDone(true);
//   };

//   if (done) {
//     return (
//       <div className="w-full max-w-sm text-center space-y-6">
//         <CheckCircle2 size={64} className="text-primary mx-auto" />
//         <div className="space-y-2">
//           <h2 className="text-2xl font-bold">تم الإرسال</h2>
//           <p className="text-muted-foreground text-sm">
//             إذا كان البريد مسجلاً ستصلك رسالة خلال دقائق.
//           </p>
//         </div>
//         <Link href="/login">
//           <Button variant="outline" className="w-full">
//             العودة لتسجيل الدخول
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-sm space-y-6">
//       <Card>
//         <CardHeader className="pb-4">
//           <CardTitle className="text-xl">نسيت كلمة المرور؟</CardTitle>
//           <CardDescription>أدخل بريدك وسنرسل لك رابط الاستعادة</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-4"
//             noValidate
//           >
//             <FormInput
//               control={control}
//               name="email"
//               label="البريد الإلكتروني"
//               type="email"
//               dir="ltr"
//               placeholder="admin@mosque.com"
//             />
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading && <Loader2 size={16} className="animate-spin ml-2" />}
//               إرسال رابط الاستعادة
//             </Button>
//           </form>
//           <p className="mt-4 text-center text-sm text-muted-foreground">
//             <Link href="/login" className="text-primary hover:underline">
//               العودة لتسجيل الدخول
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
