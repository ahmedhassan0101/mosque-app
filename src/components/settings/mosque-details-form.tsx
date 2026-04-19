"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateMosqueSchema,
  type UpdateMosqueInput,
} from "@/schemas/settings.schema";
import { updateMosqueSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTransition } from "react";
import { FormInput } from "../form/FormInput";

interface MosqueDetailsFormProps {
  mosque: { id: string; name: string; address: string; phone: string };
}

export function MosqueDetailsForm({ mosque }: MosqueDetailsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateMosqueInput>({
    resolver: zodResolver(updateMosqueSchema),
    defaultValues: {
      name: mosque.name,
      address: mosque.address,
      phone: mosque.phone,
    },
  });

  async function onSubmit(values: UpdateMosqueInput) {
    startTransition(async () => {
      const result = await updateMosqueSettings(mosque.id, values);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات المسجد</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          dir="rtl"
        >
          <FormInput control={form.control} name="name" label="اسم المسجد" />
          <FormInput control={form.control} name="address" label="العنوان" />
          <FormInput
            control={form.control}
            name="phone"
            label="رقم الهاتف"
            type="tel"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
