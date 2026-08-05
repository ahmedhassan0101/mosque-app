// src/components/groups/GroupProfileContent.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  Users,
  Calendar,
  Phone,
  Eye,
  Pencil,
  AlertCircle,
} from "lucide-react";

import { getGroupWithDetails } from "@/queries/group.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/temp/button";
import { DeleteGroupAlert } from "./DeleteGroupAlert";
import { ACTIVITIES, type ActivityType } from "@/constants";

interface GroupProfileContentProps {
  id: string;
  type: ActivityType;
}

export async function GroupProfileContent({
  id,
  type,
}: GroupProfileContentProps) {
  const group = await getGroupWithDetails(id);

  // Double guard — also catches activity mismatch
  if (!group || group.activity !== type) notFound();

  const isTeacherMissing = group.teacher === null;

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <Badge variant="secondary">
            {ACTIVITIES.labels[group.activity as ActivityType]}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/groups/${type}/${id}/edit`}>
              <Pencil size={14} className="ml-1.5" />
              تعديل
            </Link>
          </Button>
          <DeleteGroupAlert
            id={id}
            name={group.name}
            type={type}
            redirectAfterDelete
            variant="icon"
          />
        </div>
      </div>

      {/* ── Info Cards ── */}
      <section
        aria-label="معلومات المجموعة"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Teacher Card */}
        <div className="border border-border rounded-xl bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <GraduationCap size={14} />
            المعلم المسؤول
          </div>
          {isTeacherMissing ? (
            <div className="flex items-center gap-2 text-destructive/80 text-sm">
              <AlertCircle size={14} />
              <span>المعلم محذوف من النظام</span>
            </div>
          ) : (
            <>
              <p className="font-semibold text-foreground">
                {group.teacher!.name}
              </p>
              {group.teacher!.phone && (
                <p
                  className="text-sm text-muted-foreground flex items-center gap-1.5"
                  dir="ltr"
                >
                  <Phone size={12} />
                  {group.teacher!.phone}
                </p>
              )}
            </>
          )}
        </div>

        {/* Schedule Card */}
        <div className="border border-border rounded-xl bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <Calendar size={14} />
            المواعيد
          </div>
          <p className="font-semibold text-foreground">
            {group.appointment || "غير محدد"}
          </p>
        </div>

        {/* Student Count Card */}
        <div className="border border-border rounded-xl bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <Users size={14} />
            الطلاب المقيّدون
          </div>
          <p className="font-semibold text-foreground text-2xl">
            {group.students.length}
            <span className="text-sm font-normal text-muted-foreground mr-1">
              طالب
            </span>
          </p>
        </div>
      </section>

      {/* ── Notes ── */}
      {group.notes && (
        <div className="border border-border rounded-xl bg-muted/20 p-4 text-sm text-muted-foreground">
          {group.notes}
        </div>
      )}

      {/* ── Students Table ── */}
      <section aria-label="قائمة الطلاب المقيّدين">
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">الطلاب المقيّدون في هذه المجموعة</h2>
            {group.students.length > 0 && (
              <Badge variant="secondary">{group.students.length}</Badge>
            )}
          </div>

          {group.students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users size={28} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                لا يوجد طلاب مقيّدون في هذه المجموعة بعد.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك إضافة طلاب من خلال تعديل المجموعة.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
                  >
                    الطالب
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
                  >
                    رقم الهاتف
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sr-only"
                  >
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    {/* Name + Avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
                          {student.image ? (
                            <Image
                              src={student.image}
                              alt={student.name}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-primary text-[10px] font-bold">
                              {student.name[0]}
                            </span>
                          )}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {student.phone ? (
                        <span dir="ltr">{student.phone}</span>
                      ) : (
                        <span className="text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`عرض ملف ${student.name}`}
                      >
                        <Link href={`/dashboard/students/${student._id}`}>
                          <Eye size={15} />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
