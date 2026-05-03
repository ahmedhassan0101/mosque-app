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
  /** Provided when editing an existing teacher. Undefined for create mode. */
  initialData?: TeacherSerialized;
  /** The teacher's MongoDB ID. Undefined in create mode. */
  teacherId?: string;
};

export default function TeacherForm({
  initialData,
  teacherId,
}: TeacherFormProps) {
  const isEdit = !!teacherId;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),

    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      image: initialData?.image ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const onSubmit = (data: TeacherInput) => {
    startTransition(async () => {
      const result = await saveTeacher(data, teacherId);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ غير متوقع.");
        return;
      }
      toast.success(result.message);

      // Navigate back to the list.
      router.push("/dashboard/teachers");
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormImageUpload
        control={form.control}
        name="image"
        label="صورة المعلم"
        folderCategory="teachers"
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
        label="رقم الهاتف"
        placeholder="01xxxxxxxxx"
        dir="ltr"
      />
      <FormTextarea
        control={form.control}
        name="notes"
        label="ملاحظات"
        placeholder="أي ملاحظات إضافية..."
      />
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
        {isEdit ? "حفظ" : "إضافة"}
      </Button>
    </form>
  );
}
