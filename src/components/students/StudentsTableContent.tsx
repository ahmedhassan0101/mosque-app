// src/components/students/StudentsTableContent.tsx
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Users } from "lucide-react";

import { getStudentsList } from "@/lib/data/student.data";
import { calculateAge } from "@/lib/utils/age";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteStudentButton } from "./DeleteStudentButton";

const LEVEL_LABELS = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
} as const;

const LEVEL_VARIANTS = {
  beginner: "secondary",
  intermediate: "outline",
  advanced: "default",
} as const;

interface StudentsTableContentProps {
  query?: string;
  level?: string;
}

export async function StudentsTableContent({
  query,
  level,
}: StudentsTableContentProps) {
  const students = await getStudentsList();

  // Filter — move to DB query when dataset grows large
  const filtered = students.filter((s) => {
    const matchesQuery = query
      ? s.name.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesLevel = level && level !== "all" ? s.level === level : true;
    return matchesQuery && matchesLevel;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">
          {query || level ? "لا توجد نتائج مطابقة" : "لا يوجد طلاب بعد"}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {query || level
            ? "جرّب تغيير معايير البحث أو الفلترة"
            : "ابدأ بتسجيل أول طالب في المسجد"}
        </p>
        {!query && !level && (
          <Button asChild size="sm">
            <Link href="/dashboard/students/new">تسجيل طالب</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className="border border-border rounded-xl overflow-hidden bg-card"
      role="region"
      aria-label="جدول الطلاب"
    >
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            {["الطالب", "العمر", "المستوى", "ولي الأمر", "الحالة", "إجراءات"].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((student) => {
            const age = calculateAge(student.birthDate);
            // Safely access the first guardian
            const primaryGuardian = student.guardians?.[0];

            return (
              <tr
                key={student._id.toString()}
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
                    <span className="font-medium text-foreground">
                      {student.name}
                    </span>
                  </div>
                </td>

                {/* Age */}
                <td className="px-4 py-3 text-muted-foreground">
                  {age !== null ? `${age} سنة` : "—"}
                </td>

                {/* Level */}
                <td className="px-4 py-3">
                  <Badge variant={LEVEL_VARIANTS[student.level]}>
                    {LEVEL_LABELS[student.level]}
                  </Badge>
                </td>

                {/* Primary guardian phone */}
                <td className="px-4 py-3">
                  {primaryGuardian ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {primaryGuardian.relation}
                      </span>
                      <span dir="ltr" className="text-foreground text-xs">
                        {primaryGuardian.phone}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge
                    variant={student.isActive ? "default" : "secondary"}
                    className={
                      student.isActive
                        ? "bg-success/15 text-success hover:bg-success/20"
                        : ""
                    }
                  >
                    {student.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      aria-label={`تعديل ${student.name}`}
                    >
                      <Link href={`/dashboard/students/${student._id}/edit`}>
                        <Pencil size={15} />
                      </Link>
                    </Button>
                    <DeleteStudentButton
                      id={student._id.toString()}
                      name={student.name}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}