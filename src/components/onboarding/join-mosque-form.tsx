"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  joinMosqueSchema,
  type JoinMosqueInput,
} from "@/schemas/onboarding.schema";
import { joinMosque } from "@/actions/onboarding.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { FormInput } from "../form/FormInput";
import { useRouter } from "next/navigation";

export function JoinMosqueForm() {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinMosqueInput>({
    resolver: zodResolver(joinMosqueSchema),
    defaultValues: { inviteCode: "" },
  });

  async function onSubmit(values: JoinMosqueInput) {
    startTransition(async () => {
      const result = await joinMosque(values);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // تحديث الجلسة
      await update({
        mosqueId: result.data?.mosqueId,
        role: "SUPERVISOR",
      });

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      dir="rtl"
    >
      <FormInput
        control={form.control}
        name="inviteCode"
        label="رمز الدعوة"
        placeholder="AB12CD34"
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جاري الانضمام..." : "انضم إلى المسجد"}
      </Button>
    </form>
  );
}
