// // app/(auth)/onboarding/join-mosque-form.tsx
// "use client";

// import { useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import {
//   joinMosqueSchema,
//   type JoinMosqueInput,
// } from "@/schemas/onboarding.schema";
// import { Button } from "@/temp/button";
// import { AuthCard } from "@/components/auth/AuthPrimitives";
// import { joinMosque } from "@/actions/onboarding.actions";
// import { FormInput } from "../form/FormInput";

// export function JoinMosqueForm() {
//   const router = useRouter();
//   const { update } = useSession();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<JoinMosqueInput>({
//     resolver: zodResolver(joinMosqueSchema),
//     defaultValues: { inviteCode: "" },
//   });

//   function onSubmit(values: JoinMosqueInput) {
//     startTransition(async () => {
//       const result = await joinMosque(values);
//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }
//       toast.success(result.message);
//       await update({ mosqueId: result.data?.mosqueId, role: "SUPERVISOR" });
//       router.push("/dashboard");
//       router.refresh();
//     });
//   }

//   return (
//     <AuthCard>
//       <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
//         احصل على رمز الدعوة من مدير المسجد وأدخله أدناه للانضمام كمشرف.
//       </p>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4"
//         noValidate
//       >
//         <FormInput
//           control={form.control}
//           name="inviteCode"
//           label="رمز الدعوة"
//           placeholder="AB12CD34"
//           dir="ltr"
//         />
//         <Button type="submit" className="w-full" size="lg" disabled={isPending}>
//           {isPending ? "جارٍ الانضمام..." : "انضم إلى المسجد"}
//         </Button>
//       </form>
//     </AuthCard>
//   );
// }
// src/components/onboarding/JoinMosqueForm.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info } from "lucide-react";

import {
  joinMosqueSchema,
  type JoinMosqueInput,
} from "@/schemas/onboarding.schema";
import { joinMosque } from "@/actions/onboarding.actions";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "@/components/form/FormInput";

export function JoinMosqueForm() {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinMosqueInput>({
    resolver: zodResolver(joinMosqueSchema),
    defaultValues: { inviteCode: "" },
  });

  function onSubmit(values: JoinMosqueInput) {
    startTransition(async () => {
      const result = await joinMosque(values);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      await update({ mosqueId: result.data?.mosqueId, role: "SUPERVISOR" });
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Helper context — Alert بدل p tag عادي، consistent مع باقي المشروع */}
      <Alert variant="info">
        <Info />
        <AlertDescription>
          احصل على رمز الدعوة من مدير المسجد وأدخله أدناه للانضمام كمشرف
        </AlertDescription>
      </Alert>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormInput
          control={form.control}
          name="inviteCode"
          label="رمز الدعوة"
          placeholder="AB12CD34"
          dir="ltr"
          disabled={isPending}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "جارٍ الانضمام..." : "انضم إلى المسجد"}
        </Button>
      </form>
    </div>
  );
}
