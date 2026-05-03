// src/components/students/StudentProfileContent.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  MapPin,
  BookOpen,
  Users,
  Calendar,
  Pencil,
  FileText,
  BookMarked,
  Hash,
} from "lucide-react";

import { getStudentProfile } from "@/lib/data/student.data";
import { calculateAge } from "@/lib/utils/age";
import { ACTIVITY_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteStudentButton } from "./DeleteStudentButton";
import type { StudentGroupSummary } from "@/lib/data/student.data";

const LEVEL_LABELS = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
} as const;

const GENDER_LABELS = {
  male: "ذكر",
  female: "أنثى",
} as const;

interface StudentProfileContentProps {
  id: string;
}

/** A single group card in the student's groups section */
function GroupCard({ group }: { group: StudentGroupSummary }) {
  return (
    <Link
      href={`/dashboard/groups/${group.activity}/${group._id}`}
      className="flex items-start justify-between p-3 border border-border rounded-lg bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all"
    >
      <div className="space-y-1">
        <p className="font-medium text-sm">{group.name}</p>
        <p className="text-xs text-muted-foreground">
          المعلم: {group.teacherName}
        </p>
        {group.appointment && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar size={11} />
            {group.appointment}
          </p>
        )}
      </div>
      <Badge variant="secondary" className="shrink-0 text-xs">
        {ACTIVITY_LABELS[group.activity]}
      </Badge>
    </Link>
  );
}

/**
 * Async Server Component — fetches and renders the student's Bento Grid profile.
 * Calls notFound() if the student doesn't exist.
 */
export async function StudentProfileContent({ id }: StudentProfileContentProps) {
  const data = await getStudentProfile(id);
  if (!data) notFound();

  const { student, groups } = data;
  const age = calculateAge(student.birthDate);
  const initials = student.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("");

  // Primary guardian is always the first — others are shown below
  const [primaryGuardian, ...otherGuardians] = student.guardians ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">

      {/* ══ 1. Hero Card — spans 2 columns ══════════════════════════════ */}
      <section
        aria-label="البيانات الأساسية"
        className="md:col-span-2 border border-border rounded-xl bg-card overflow-hidden"
      >
        <div className="h-1.5 bg-linear-to-l from-primary/50 to-primary" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
              {student.image ? (
                <Image
                  src={student.image}
                  alt={student.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="text-primary font-bold text-2xl">{initials}</span>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {GENDER_LABELS[student.gender]} ·{" "}
                    {age !== null ? `${age} سنة` : "العمر غير محدد"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        student.isActive
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {student.isActive ? "نشط" : "غير نشط"}
                    </Badge>
                    <Badge variant="outline">
                      {LEVEL_LABELS[student.level]}
                    </Badge>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/students/${id}/edit`}>
                      <Pencil size={13} className="ml-1.5" />
                      تعديل
                    </Link>
                  </Button>
                  <DeleteStudentButton
                    id={id}
                    name={student.name}
                    redirectAfterDelete
                    variant="icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {student.notes && (
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">
              <FileText size={13} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">{student.notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══ 2. Info Card ══════════════════════════════════════════════════ */}
      <section
        aria-label="بيانات التواصل والعنوان"
        className="border border-border rounded-xl bg-card p-5 space-y-4"
      >
        <h3 className="font-semibold text-sm text-muted-foreground border-b border-border pb-2">
          بيانات التواصل
        </h3>

        {/* Student phone */}
        {student.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={13} className="text-muted-foreground shrink-0" />
            <span dir="ltr">{student.phone}</span>
          </div>
        )}

        {/* Address */}
        {student.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={13} className="text-muted-foreground shrink-0 mt-0.5" />
            <span>{student.address}</span>
          </div>
        )}

        {/* Primary guardian */}
        {primaryGuardian ? (
          <div className="space-y-1 pt-1 border-t border-border">
            <p className="text-xs text-muted-foreground">
              ولي الأمر ({primaryGuardian.relation})
            </p>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Phone size={12} className="text-muted-foreground" />
              <span dir="ltr">{primaryGuardian.phone}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">لا توجد بيانات تواصل</p>
        )}

        {/* Other guardians */}
        {otherGuardians.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-border">
            {otherGuardians.map((g, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{g.relation}</p>
                <p className="text-sm" dir="ltr">{g.phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══ 3. Quran Progress Card ════════════════════════════════════════ */}
      <section
        aria-label="متابعة الحفظ"
        className="border border-border rounded-xl bg-card p-5 space-y-4"
      >
        <h3 className="font-semibold text-sm text-muted-foreground border-b border-border pb-2">
          متابعة الحفظ
        </h3>

        {student.currentSurah ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookMarked size={16} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">السورة الحالية</p>
                <p className="font-semibold">{student.currentSurah}</p>
              </div>
            </div>
            {student.currentAyah && (
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">رقم الآية</p>
                  <p className="font-medium">{student.currentAyah}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BookOpen size={24} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              لم يُسجَّل تقدم في الحفظ بعد
            </p>
          </div>
        )}
      </section>

      {/* ══ 4. Groups Card — spans 2 columns ═════════════════════════════ */}
      <section
        aria-label="المجموعات المسجّل بها"
        className="md:col-span-2 border border-border rounded-xl bg-card p-5 space-y-3"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-semibold text-sm text-muted-foreground">
            المجموعات المسجّل بها
          </h3>
          {groups.length > 0 && (
            <Badge variant="secondary">{groups.length}</Badge>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users size={24} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              الطالب غير مسجّل في أي مجموعة حالياً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}