// src\components\teacher\teacher-form.tsx
"use client";

import { useTransition } from "react";
import { TeacherInput, teacherSchema } from "@/schemas/teacher.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "../form/FormInput";
import { FormTextarea } from "../form/FormTextarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveTeacher } from "@/actions/teacher.actions";
import { useRouter } from "next/navigation";
import { FormImageUpload } from "../form/form-image-upload";
import { TeacherSerialized } from "@/lib/data/teacher.data";

type TeacherFormProps = {
  initialData?: TeacherSerialized;
  teacherId?: string;
};

export default function TeacherForm({
  initialData,
  teacherId,
}: TeacherFormProps) {
  const isEdit = !!teacherId;
  const router = useRouter();
  const { name = "", phone = "", image = "", notes = "" } = initialData || {};
  const [isPending, startTransition] = useTransition();
  const form = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name,
      phone,
      image,
      notes,
    },
  });

  const onSubmit = (data: TeacherInput) => {
    startTransition(async () => {
      const result = await saveTeacher(data, teacherId);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/dashboard/teachers");
      router.refresh();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormImageUpload
        control={form.control}
        name="image" // اعتمدنا تسمية image
        label="صورة المعلم"
        folderCategory="teachers" // <-- التوجيه الديناميكي هنا
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
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
        {isEdit ? "حفظ" : "إضافة"}
      </Button>
    </form>
  );
}
