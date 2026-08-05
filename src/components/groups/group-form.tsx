// src/components/groups/GroupForm.tsx
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { groupSchema, type GroupInput } from "@/schemas/group.schema";
import { saveGroup } from "@/actions/group.actions";
import type { GroupSerialized } from "@/types/serialized";

import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/temp/button";
import { FormCheckboxGroup } from "../form/FormCheckboxGroup";

// ─── Types ────────────────────────────────────────────────────────────────

interface GroupFormProps {
  initialData?: GroupSerialized | null;
  groupId?: string;
  /** The activity category — passed from the URL segment, e.g. "quran" */
  category: GroupInput["activity"];
  teachers: { label: string; value: string }[];
  students: { label: string; value: string }[];
}

const ACTIVITY_LABELS: Record<GroupInput["activity"], string> = {
  quran: "قرآن كريم",
  tarbiya: "التربية",
  tajweed: "التجويد",
  maqraa: "المقرأة",
  playground: "الملعب",
};

export default function GroupForm({
  initialData,
  groupId,
  category,
  teachers,
  students,
}: GroupFormProps) {
  const router = useRouter();
  const isEdit = !!groupId;
  const [isPending, startTransition] = useTransition();

  const form = useForm<GroupInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      activity: initialData?.activity ?? category,
      teacherId: initialData?.teacherId ?? "",
      studentIds: initialData?.studentIds?.map((id) => String(id)) ?? [],
      appointment: initialData?.appointment ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const onSubmit = (data: GroupInput) => {
    startTransition(async () => {
      const result = await saveGroup(data, groupId);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ غير متوقع.");
        return;
      }

      toast.success(result.message);
      router.push(`/dashboard/groups/${category}`);
    });
  };
  // const selectedStudentIds = form.watch("studentIds") ?? [];
  //   Compilation Skipped: Use of incompatible library

  // This API returns functions which cannot be memoized without leading to stale UI. To prevent this, by default React Compiler will skip memoizing this component/hook. However, you may see issues if values from this API are passed to other components/hooks that are memoized.

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* ── نوع النشاط (للقراءة فقط) ── */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
        <span className="text-sm text-muted-foreground font-medium">
          نوع النشاط
        </span>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
          {ACTIVITY_LABELS[category]}
        </span>
      </div>

      {/* ── البيانات الأساسية ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          control={form.control}
          name="name"
          label="اسم المجموعة / الحلقة"
          placeholder="مثال: حلقة الفجر"
          required
        />

        <FormSelect
          control={form.control}
          name="teacherId"
          label="المعلم المسؤول"
          options={teachers}
          placeholder="-- اختر معلماً --"
        />

        <FormInput
          control={form.control}
          name="appointment"
          label="المواعيد (اختياري)"
          placeholder="مثال: السبت والثلاثاء بعد العصر"
        />
      </div>

      {/* ── اختيار الطلاب ── */}
      <section className="space-y-3">
        {students.length === 0 ? (
          // رسالة في حالة عدم وجود طلاب خالص في المسجد
          <div className="border p-4 rounded-lg bg-muted/20 text-center text-muted-foreground py-4 text-sm">
            لا يوجد طلاب مسجلون في المسجد حالياً.
          </div>
        ) : (
          <div className="border p-4 rounded-lg max-h-72 overflow-y-auto bg-muted/20">
            <FormCheckboxGroup
              control={form.control}
              name="studentIds"
              label="الطلاب المقيدين في هذه المجموعة"
              options={students}
            />
          </div>
        )}
      </section>

      {/* ── ملاحظات ── */}
      <FormTextarea
        control={form.control}
        name="notes"
        label="ملاحظات (اختياري)"
        placeholder="أي ملاحظات تخص المجموعة..."
      />

      {/* ── أزرار الإرسال ── */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
          {isEdit ? "تحديث البيانات" : "إنشاء المجموعة"}
        </Button>
      </div>
    </form>
  );
}
