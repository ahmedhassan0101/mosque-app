// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   createMosqueSchema,
//   type CreateMosqueInput,
// } from "@/schemas/onboarding.schema";
// import { createMosque } from "@/actions/onboarding.actions";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import { useTransition } from "react";
// import { FormInput } from "../form/FormInput";
// import { useRouter } from "next/navigation";

// export function CreateMosqueForm() {
//   const router = useRouter();
//   const { update } = useSession();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<CreateMosqueInput>({
//     resolver: zodResolver(createMosqueSchema),
//     defaultValues: { name: "", address: "", phone: "" },
//   });

//   async function onSubmit(values: CreateMosqueInput) {
//     startTransition(async () => {
//       const result = await createMosque(values);

//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       toast.success(result.message);

//       await update({
//         mosqueId: result.data?.mosqueId,
//         role: "ADMIN",
//       });

//       router.push("/dashboard");
//       router.refresh();
//     });
//   }

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-4"
//       dir="rtl"
//     >
//       <FormInput
//         control={form.control}
//         name="name"
//         label="اسم المسجد"
//         placeholder="مسجد النور"
//       />
//       <FormInput
//         control={form.control}
//         name="address"
//         label="العنوان"
//         placeholder="شارع الملك فهد، الرياض"
//       />
//       <FormInput
//         control={form.control}
//         name="phone"
//         label="رقم الهاتف"
//         placeholder="0512345678"
//         type="tel"
//       />

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "جاري الإنشاء..." : "إنشاء المسجد"}
//       </Button>
//     </form>
//   );
// }

// app/(auth)/onboarding/create-mosque-form.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createMosqueSchema,
  type CreateMosqueInput,
} from "@/schemas/onboarding.schema";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-primitives";
import { createMosque } from "@/actions/onboarding.actions";
import { FormInput } from "../form/FormInput";

export function CreateMosqueForm() {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateMosqueInput>({
    resolver: zodResolver(createMosqueSchema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  function onSubmit(values: CreateMosqueInput) {
    startTransition(async () => {
      const result = await createMosque(values);
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      await update({ mosqueId: result.data?.mosqueId, role: "ADMIN" });
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <AuthCard>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormInput
          control={form.control}
          name="name"
          label="اسم المسجد"
          placeholder="مسجد النور"
        />
        <FormInput
          control={form.control}
          name="address"
          label="العنوان"
          placeholder="شارع الملك فهد، الرياض"
        />
        <FormInput
          control={form.control}
          name="phone"
          label="رقم الهاتف"
          placeholder="0512345678"
          type="tel"
          dir="ltr"
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "جارٍ الإنشاء..." : "إنشاء المسجد"}
        </Button>
      </form>
    </AuthCard>
  );
}
