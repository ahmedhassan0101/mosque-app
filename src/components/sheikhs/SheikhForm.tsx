// src/components/sheikhs/SheikhForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormTextarea } from "../form/FormTextarea";
import { FormInput } from "../form/FormInput";
import { sheikhSchema } from "@/lib/validations/sheikh";
import { FormImageUpload } from "../form/FormImageUpload";
import { useTransition } from "react";
import { saveSheikhAction } from "@/lib/services/sheikh.actions";
import { toast } from "sonner";

type SheikhFormData = z.infer<typeof sheikhSchema>;

interface SheikhFormProps {
  defaultValues?: Partial<SheikhFormData>;
  sheikhId?: string;
}
export function SheikhForm({ defaultValues, sheikhId }: SheikhFormProps) {
  const router = useRouter();
  const isEdit = !!sheikhId;
  
  const [isPending, startTransition] = useTransition();

  const form = useForm<SheikhFormData>({
    resolver: zodResolver(sheikhSchema),
    defaultValues: {
      name: "",
      phone: "",
      photo: "",
      notes: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: SheikhFormData) => {
    startTransition(async () => {
      const result = await saveSheikhAction(data, sheikhId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEdit ? "تم تحديث البيانات بنجاح" : "تمت الإضافة بنجاح");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">بيانات الشيخ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormImageUpload
            control={form.control}
            name="photo"
            label="صورة الشيخ"
          />
          <FormInput
            control={form.control}
            name="name"
            label="الاسم"
            placeholder="الشيخ أحمد"
            required
          />
          <FormInput
            control={form.control}
            name="phone"
            label="رقم التليفون"
            placeholder="01xxxxxxxxx"
            dir="ltr"
          />
          <FormTextarea control={form.control} name="notes" label="ملاحظات" />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
          {isEdit ? "حفظ" : "إضافة"}
        </Button>
      </div>
    </form>
  );
}
