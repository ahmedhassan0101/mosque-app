// src/components/teacher/TeacherProfileContent.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  FileText,
  Users,
  BookOpen,
  Calendar,
  Pencil,
} from "lucide-react";

import { getTeacherProfile } from "@/lib/data/teacher.data";
import { ACTIVITY_LABELS } from "@/types";
import type { TeacherGroupSummary } from "@/lib/data/teacher.data";
import { Button } from "@/components/ui/button";
import { DeleteTeacherButton } from "./DeleteTeacherButton";

interface TeacherProfileContentProps {
  id: string;
}

/** Renders a single group summary card on the teacher profile page. */
function GroupSummaryCard({ group }: { group: TeacherGroupSummary }) {
  return (
    <Link
      href={`/dashboard/groups/${group.activity}/${group._id}`}
      className="block border border-border rounded-lg p-4 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-sm text-foreground">{group.name}</h4>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
          {ACTIVITY_LABELS[group.activity]}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users size={12} />
          <span>{group.studentCount} طالب</span>
        </div>
        {group.appointment && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>{group.appointment}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * Async Server Component — fetches and renders the full teacher profile.
 * Calls notFound() internally if teacher doesn't exist.
 */
export async function TeacherProfileContent({
  id,
}: TeacherProfileContentProps) {
  const data = await getTeacherProfile(id);

  if (!data) notFound();

  const { teacher, groups, totalStudents } = data;

  const initials = teacher.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="space-y-6">
      {/* ── Teacher info card ── */}
      <section
        aria-label="بيانات المعلم"
        className="border border-border rounded-xl bg-card overflow-hidden"
      >
        {/* Accent bar */}
        <div className="h-1.5 bg-linear-to-l from-primary/50 to-primary" />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
              {teacher.image ? (
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              ) : (
                <span className="text-primary font-bold text-2xl">
                  {initials}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {teacher.name}
                  </h2>
                  {teacher.phone && (
                    <p
                      className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"
                      dir="ltr"
                    >
                      <Phone size={13} />
                      {teacher.phone}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teachers/${id}/edit`}>
                      <Pencil size={14} className="ml-1.5" />
                      تعديل
                    </Link>
                  </Button>
                  <DeleteTeacherButton
                    id={id}
                    name={teacher.name}
                    redirectAfterDelete
                  />
                </div>
              </div>

              {/* Notes */}
              {teacher.notes && (
                <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">
                  <FileText size={14} className="shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{teacher.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المجموعات</p>
                <p className="font-semibold text-foreground">{groups.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">إجمالي الطلاب</p>
                <p className="font-semibold text-foreground">{totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Groups section ── */}
      <section aria-label="مجموعات المعلم">
        <h3 className="font-semibold text-base mb-3">المجموعات المسؤول عنها</h3>

        {groups.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center">
            <BookOpen
              size={32}
              className="mx-auto text-muted-foreground mb-3"
            />
            <p className="text-sm text-muted-foreground">
              لم يُسند لهذا المعلم أي مجموعة بعد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.map((group) => (
              <GroupSummaryCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
