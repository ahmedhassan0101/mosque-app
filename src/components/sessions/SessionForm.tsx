// // src/components/sessions/SessionForm.tsx
// "use client";

// import { useMemo, useTransition } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// import { sessionSchema, type SessionInput } from "@/schemas/session.schema";
// import { createSession, updateSession } from "@/actions/session.actions";
// import { ACTIVITIES, BEHAVIORS, type ActivityType } from "@/constants";
// import { Button } from "@/components/ui/button";
// import { FormDatePicker } from "@/components/form/FormDatePicker";
// import { FormSelect } from "@/components/form/FormSelect";
// import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
// import { SessionContentFields } from "./SessionContentFields";
// import { SessionAttendanceList } from "./SessionAttendanceList";

// import type { SessionSerialized } from "@/queries/session.queries";
// import type { TeacherSerialized } from "@/types/serialized";
// import { FormTextarea } from "../form/FormTextarea";
// import { GroupOption } from "@/queries/group.queries";

// interface SessionFormProps {
//   initialData?: SessionSerialized | null;
//   sessionId?: string;
//   teachers: TeacherSerialized[];
//   groups: GroupOption[];
// }

// export default function SessionForm({
//   initialData,
//   sessionId,
//   teachers,
//   groups,
// }: SessionFormProps) {
//   const isEdit = !!sessionId;
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   // ── Form ─────────────────────────────────────────────────────────────

//   const form = useForm<SessionInput>({
//     resolver: zodResolver(sessionSchema),

//     defaultValues: {
//       groupIds: initialData ? [initialData.groupId.toString()] : [],
//       activity: (initialData?.activity as ActivityType) ?? undefined,
//       date: initialData?.date ? new Date(initialData.date) : new Date(),
//       teacherId: initialData?.teacherId?.toString() ?? "",
//       attendedStudentIds: initialData?.attendedStudentIds?.map(String) ?? [],
//       content: {
//         title: initialData?.content?.title ?? "",
//         book: initialData?.content?.book ?? "",
//         fromSurah: initialData?.content?.fromSurah ?? "",
//         fromAyah: initialData?.content?.fromAyah ?? undefined,
//         toSurah: initialData?.content?.toSurah ?? "",
//         toAyah: initialData?.content?.toAyah ?? undefined,
//       },
//       behaviorTags: initialData?.behaviorTags ?? [],
//       notes: initialData?.notes ?? "",
//     },
//   });

//   const {
//     setValue,
//     getValues,
//     formState: { errors },
//   } = form;

//   const selectedActivity = useWatch({
//     control: form.control,
//     name: "activity",
//   });
//   const selectedGroupIds =
//     useWatch({ control: form.control, name: "groupIds" }) ?? [];

//   // ── Derived options ────────────────────────────────────────────────────────

//   const teacherOptions = useMemo(
//     () => teachers.map((t) => ({ label: t.name, value: t._id.toString() })),
//     [teachers],
//   );

//   /**
//    * Filter groups by activity client-side — no extra server fetch..
//    */
//   const groupOptions = useMemo(() => {
//     if (!selectedActivity) return [];
//     return groups
//       .filter((g) => g.activity === selectedActivity)
//       .map((g) => ({ label: g.name, value: g._id }));
//   }, [groups, selectedActivity]);

//   // ── Submit ─────────────────────────────────────────────────────────────────
//   const onSubmit = (data: SessionInput) => {
//     startTransition(async () => {
//       const result = isEdit
//         ? await updateSession(sessionId, data)
//         : await createSession(data);

//       if (result.status !== "success") {
//         toast.error(result.message ?? "حدث خطأ غير متوقع.");
//         return;
//       }

//       toast.success(result.message);
//       router.push("/dashboard/sessions");
//     });
//   };

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-8"
//       dir="rtl"
//       // noValidate
//     >
//       {/* ══ Card 1: البيانات الأساسية ══════════════════════════════════════ */}
//       <div className="p-5 rounded-xl border border-border bg-card space-y-4">
//         <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
//           البيانات الأساسية
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormDatePicker
//             control={form.control}
//             name="date"
//             label="تاريخ الجلسة"
//             required
//           />
//           <FormSelect
//             control={form.control}
//             name="activity"
//             label="نوع النشاط"
//             options={ACTIVITIES.options}
//             placeholder="-- اختر النشاط --"
//             required
//           />
//         </div>

//         <FormSelect
//           control={form.control}
//           name="teacherId"
//           label="المعلم المسؤول"
//           options={teacherOptions}
//           placeholder="-- اختر المعلم --"
//           required
//         />
//       </div>

//       {/* ══ Card 2: المجموعات ══════════════════════════════════════════════ */}
//       <div className="p-5 rounded-xl border border-border bg-card space-y-3">
//         <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
//           {isEdit ? "المجموعة" : "المجموعات"}
//         </h2>

//         {isEdit ? (
//           // Edit mode: locked display
//           <div className="p-3 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
//             {groups.find((g) => g._id === selectedGroupIds[0])?.name ??
//               "المجموعة المحددة"}
//             <span className="mr-2 text-xs">
//               (لا يمكن تغيير المجموعة عند التعديل)
//             </span>
//           </div>
//         ) : !selectedActivity ? (
//           <p className="text-sm text-muted-foreground py-2">
//             اختر نوع النشاط أولاً لعرض المجموعات المتاحة
//           </p>
//         ) : groupOptions.length === 0 ? (
//           <p className="text-sm text-muted-foreground py-2">
//             لا توجد مجموعات لهذا النشاط
//           </p>
//         ) : (
//           <FormCheckboxGroup
//             control={form.control}
//             name="groupIds"
//             label=""
//             options={groupOptions}
//           />
//         )}

//         {errors.groupIds && (
//           <p className="text-xs text-destructive">{errors.groupIds.message}</p>
//         )}
//       </div>

//       {/* ══ Card 3: تسجيل الحضور ════════════════════════════════════════════ */}
//       <SessionAttendanceList
//         groupIds={selectedGroupIds}
//         getValue={getValues}
//         setValue={setValue}
//         error={errors.attendedStudentIds?.message}
//       />

//       {/* ══ Card 4: محتوى الجلسة (ديناميكي) ═══════════════════════════════ */}
//       <SessionContentFields
//         control={form.control}
//         activity={selectedActivity as ActivityType | undefined}
//       />

//       {/* ══ Card 5: تقييم الجلسة ════════════════════════════════════════════ */}
//       <div className="p-5 rounded-xl border border-border bg-card space-y-4">
//         <h2 className="text-sm font-semibold text-muted-foreground border-b pb-2">
//           تقييم الجلسة العام
//         </h2>

//         <FormCheckboxGroup
//           control={form.control}
//           name="behaviorTags"
//           label="وصف الجلسة"
//           options={BEHAVIORS.options}
//         />

//         <FormTextarea
//           control={form.control}
//           name="notes"
//           label="ملاحظات عامة (اختياري)"
//           placeholder="أي ملاحظات تخص سير الجلسة..."
//           rows={3}
//         />
//       </div>
//       {/* ══ Submit ══════════════════════════════════════════════════════════ */}
//       <div className="flex justify-end gap-3 pt-2 border-t">
//         <Button
//           type="button"
//           variant="ghost"
//           onClick={() => router.back()}
//           disabled={isPending}
//         >
//           إلغاء
//         </Button>
//         <Button type="submit" disabled={isPending}>
//           {isPending && <Loader2 size={14} className="animate-spin ml-2" />}
//           {isEdit ? "حفظ التعديلات" : "تسجيل الجلسة"}
//         </Button>
//       </div>
//     </form>
//   );
// }
// src/components/sessions/SessionForm.tsx
"use client";

import { useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  CalendarDays,
  Users,
  ClipboardCheck,
  BookOpen,
  Sparkles,
  Info,
} from "lucide-react";

import { sessionSchema, type SessionInput } from "@/schemas/session.schema";
import { createSession, updateSession } from "@/actions/session.actions";
import { ACTIVITIES, BEHAVIORS, type ActivityType } from "@/constants";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, SectionTitle } from "@/components/ui/card";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
import { FormTextarea } from "@/components/form/FormTextarea";

import { SessionContentFields } from "./SessionContentFields";
import { SessionAttendanceList } from "./SessionAttendanceList";

import type { SessionSerialized } from "@/queries/session.queries";
import type { TeacherSerialized } from "@/types/serialized";
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
        toast.error(result.message ?? "حدث خطأ غير متوقع أثناء حفظ الجلسة.");
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
      className="flex flex-col gap-6"
      dir="rtl"
    >
      <fieldset
        disabled={isPending}
        className="m-0 flex flex-col gap-6 border-0 p-0"
      >
        {/* ══ Card 1: البيانات الأساسية ══════════════════════════════════════ */}
        <Card>
          <CardHeader divider>
            <SectionTitle icon={CalendarDays}>
              إعدادات الجلسة الأساسية
            </SectionTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormDatePicker
              control={form.control}
              name="date"
              label="تاريخ انعقاد الجلسة"
              required
            />
            <FormSelect
              control={form.control}
              name="activity"
              label="المسار التعليمي / النشاط"
              options={ACTIVITIES.options}
              placeholder="-- اختر نوع النشاط --"
              required
            />
            {/* جعلنا اختيار المعلم يأخذ المساحة العرضية كاملة إذا لزم الأمر */}
            <div className="md:col-span-2">
              <FormSelect
                control={form.control}
                name="teacherId"
                label="المعلم المنفذ للجلسة"
                options={teacherOptions}
                placeholder="-- حدد المعلم المسؤول --"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* ══ Card 2: المجموعات ══════════════════════════════════════════════ */}
        <Card>
          <CardHeader divider>
            <SectionTitle icon={Users}>
              الحلقات والمجموعات المشاركة
            </SectionTitle>
          </CardHeader>
          <CardContent>
            {isEdit ? (
              // حالة التعديل: إظهار المجموعة بشكل مقفول (Read-only) لحماية البيانات
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
                <Info className="text-muted-foreground" size={20} />
                <div>
                  <p className="font-medium">
                    {groups.find((g) => g._id === selectedGroupIds[0])?.name ??
                      "الحلقة المحددة مسبقاً"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    لا يمكن تغيير الحلقة المرتبطة بهذه الجلسة حفاظاً على دقة
                    سجلات الحضور.
                  </p>
                </div>
              </div>
            ) : !selectedActivity ? (
              // حالة عدم اختيار نشاط
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-8 text-center text-sm text-muted-foreground">
                <Users className="mb-2 opacity-20" size={32} />
                يرجى تحديد المسار التعليمي أولاً لعرض الحلقات المرتبطة به.
              </div>
            ) : groupOptions.length === 0 ? (
              // حالة عدم وجود مجموعات لهذا النشاط
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-8 text-center text-sm text-muted-foreground">
                لا توجد حلقات مسجلة تحت هذا النشاط حالياً.
              </div>
            ) : (
              <div className="space-y-2">
                <FormCheckboxGroup
                  control={form.control}
                  name="groupIds"
                  label="اختر حلقة أو أكثر لإضافتها لهذه الجلسة"
                  options={groupOptions}
                  layout="grid"
                  columns={2}
                  variant="card"
                />
                {errors.groupIds && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.groupIds.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ══ Card 3: تسجيل الحضور ════════════════════════════════════════════ */}
        {/* ملاحظة: إذا كان مكون SessionAttendanceList يحتوي على كارت داخلي، يمكنك إزالة الـ Card هنا والاكتفاء بمناداته */}
        <Card>
          <CardHeader divider>
            <SectionTitle icon={ClipboardCheck}>
              سجل الحضور والغياب
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <SessionAttendanceList
              groupIds={selectedGroupIds}
              getValue={getValues}
              setValue={setValue}
              error={errors.attendedStudentIds?.message}
            />
          </CardContent>
        </Card>

        {/* ══ Card 4: محتوى الجلسة (ديناميكي) ═══════════════════════════════ */}
        {/* <Card>
          <CardHeader divider>
            <SectionTitle icon={BookOpen}>المحتوى الإنجازي للجلسة</SectionTitle>
          </CardHeader>
          <CardContent> */}
        <SessionContentFields
          control={form.control}
          activity={selectedActivity as ActivityType | undefined}
        />
        {/* </CardContent>
        </Card> */}

        {/* ══ Card 5: تقييم الجلسة ════════════════════════════════════════════ */}
        <Card>
          <CardHeader divider>
            <SectionTitle icon={Sparkles}>التقييم والملاحظات</SectionTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormCheckboxGroup
              control={form.control}
              name="behaviorTags"
              label="التقييم العام للنشاط"
              options={BEHAVIORS.options}
              layout="grid"
              columns={3}
              variant="card"
            />

            <FormTextarea
              control={form.control}
              name="notes"
              label="ملاحظات إضافية"
              placeholder="دوّن هنا أي ملاحظات حول أداء الطلاب، أو تحديات واجهتك خلال إقامة النشاط..."
              rows={4}
            />
          </CardContent>
        </Card>
      </fieldset>

      {/* ══ Sticky Action Footer ══════════════════════════════════════════ */}
      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="w-24"
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending && <Loader2 size={16} className="me-2 animate-spin" />}
          {isEdit ? "حفظ التعديلات" : "اعتماد وتسجيل الجلسة"}
        </Button>
      </div>
    </form>
  );
}
