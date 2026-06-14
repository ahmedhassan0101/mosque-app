// src/components/sessions/SessionForm.tsx
"use client";

import { useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { sessionSchema, type SessionInput } from "@/schemas/session.schema";
import { createSession, updateSession } from "@/actions/session.actions";
import { ACTIVITIES, BEHAVIORS, type ActivityType } from "@/constants";
import { Button } from "@/components/ui/button";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
import { SessionContentFields } from "./SessionContentFields";
import { SessionAttendanceList } from "./SessionAttendanceList";

import type { SessionSerialized } from "@/queries/session.queries";
import type { TeacherSerialized } from "@/types/serialized";
import { FormTextarea } from "../form/FormTextarea";
import { GroupOption } from "@/queries/group.queries";

interface SessionFormProps {
  initialData?: SessionSerialized | null;
  sessionId?: string;
  teachers: TeacherSerialized[];
  groups: GroupOption[];
}

export default function SessionForm({
  initialData,
  sessionId,
  teachers,
  groups,
}: SessionFormProps) {
  const isEdit = !!sessionId;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Form ─────────────────────────────────────────────────────────────

  const form = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema),

    defaultValues: {
      groupIds: initialData ? [initialData.groupId.toString()] : [],
      activity: (initialData?.activity as ActivityType) ?? undefined,
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      teacherId: initialData?.teacherId?.toString() ?? "",
      attendedStudentIds: initialData?.attendedStudentIds?.map(String) ?? [],
      content: {
        title: initialData?.content?.title ?? "",
        book: initialData?.content?.book ?? "",
        fromSurah: initialData?.content?.fromSurah ?? "",
        fromAyah: initialData?.content?.fromAyah ?? undefined,
        toSurah: initialData?.content?.toSurah ?? "",
        toAyah: initialData?.content?.toAyah ?? undefined,
      },
      behaviorTags: initialData?.behaviorTags ?? [],
      notes: initialData?.notes ?? "",
    },
  });

  const {
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const selectedActivity = useWatch({
    control: form.control,
    name: "activity",
  });
  const selectedGroupIds =
    useWatch({ control: form.control, name: "groupIds" }) ?? [];

  // ── Derived options ────────────────────────────────────────────────────────

  const teacherOptions = useMemo(
    () => teachers.map((t) => ({ label: t.name, value: t._id.toString() })),
    [teachers],
  );

  /**
   * Filter groups by activity client-side — no extra server fetch..
   */
  const groupOptions = useMemo(() => {
    if (!selectedActivity) return [];
    return groups
      .filter((g) => g.activity === selectedActivity)
      .map((g) => ({ label: g.name, value: g._id }));
  }, [groups, selectedActivity]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = (data: SessionInput) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateSession(sessionId, data)
        : await createSession(data);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ غير متوقع.");
        return;
      }

      toast.success(result.message);
      router.push("/dashboard/sessions");
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      dir="rtl"
      // noValidate
    >
      {/* ══ Card 1: البيانات الأساسية ══════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
          البيانات الأساسية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDatePicker
            control={form.control}
            name="date"
            label="تاريخ الجلسة"
            required
          />
          <FormSelect
            control={form.control}
            name="activity"
            label="نوع النشاط"
            options={ACTIVITIES.options}
            placeholder="-- اختر النشاط --"
            required
          />
        </div>

        <FormSelect
          control={form.control}
          name="teacherId"
          label="المعلم المسؤول"
          options={teacherOptions}
          placeholder="-- اختر المعلم --"
          required
        />
      </div>

      {/* ══ Card 2: المجموعات ══════════════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
          {isEdit ? "المجموعة" : "المجموعات"}
        </h2>

        {isEdit ? (
          // Edit mode: locked display
          <div className="p-3 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
            {groups.find((g) => g._id === selectedGroupIds[0])?.name ??
              "المجموعة المحددة"}
            <span className="mr-2 text-xs">
              (لا يمكن تغيير المجموعة عند التعديل)
            </span>
          </div>
        ) : !selectedActivity ? (
          <p className="text-sm text-muted-foreground py-2">
            اختر نوع النشاط أولاً لعرض المجموعات المتاحة
          </p>
        ) : groupOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            لا توجد مجموعات لهذا النشاط
          </p>
        ) : (
          <FormCheckboxGroup
            control={form.control}
            name="groupIds"
            label=""
            options={groupOptions}
          />
        )}

        {errors.groupIds && (
          <p className="text-xs text-destructive">{errors.groupIds.message}</p>
        )}
      </div>

      {/* ══ Card 3: تسجيل الحضور ════════════════════════════════════════════ */}
      <SessionAttendanceList
        groupIds={selectedGroupIds}
        getValue={getValues}
        setValue={setValue}
        error={errors.attendedStudentIds?.message}
      />

      {/* ══ Card 4: محتوى الجلسة (ديناميكي) ═══════════════════════════════ */}
      <SessionContentFields
        control={form.control}
        activity={selectedActivity as ActivityType | undefined}
      />

      {/* ══ Card 5: تقييم الجلسة ════════════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
          تقييم الجلسة العام
        </h2>

        <FormCheckboxGroup
          control={form.control}
          name="behaviorTags"
          label="وصف الجلسة"
          options={BEHAVIORS.options}
        />

        <FormTextarea
          control={form.control}
          name="notes"
          label="ملاحظات عامة (اختياري)"
          placeholder="أي ملاحظات تخص سير الجلسة..."
          rows={3}
        />
      </div>
      {/* ══ Submit ══════════════════════════════════════════════════════════ */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
          {isEdit ? "حفظ التعديلات" : "تسجيل الجلسة"}
        </Button>
      </div>
    </form>
  );
}
