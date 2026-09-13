"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateMosqueSchema,
  type UpdateMosqueInput,
} from "@/schemas/settings.schema";
import { updateMosqueSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useTransition } from "react";
import { FormInput } from "../form/FormInput";
import { Save } from "lucide-react";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>بيانات المسجد</CardTitle>
        <CardDescription>
          المعلومات الأساسية التي تظهر لأعضاء المسجد والتقارير.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="mosque-details-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="form-fields-grid  md:grid-cols-2"
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
            type="tel"
            placeholder="0512345678"
            dir="ltr"
          />
        </form>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-4 flex justify-end rounded-b-xl border-t">
        <Button
          type="submit"
          form="mosque-details-form"
          disabled={isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
      </CardFooter>
    </Card>
  );
}
