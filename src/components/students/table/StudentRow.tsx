// src/app/(dashboard)/dashboard/students/StudentRow.tsx
"use client";

/**
 * StudentRow — isolated Client Component per row.
 *
 * Why a separate component?
 * We need useState to track the "deleting" state for THIS row only.
 * If we put useState in StudentsTable, ALL rows re-render on every state change.
 * By isolating state to each row, only the affected row re-renders.
 *
 * Pattern: Each row manages its own isPendingDelete state.
 * When deletion starts → row becomes visually disabled (opacity + pointer-events).
 * When deletion fails → row restores to normal.
 * When deletion succeeds → row disappears (revalidatePath removes it from data).
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import type { StudentSerialized } from "@/types/serialized";

import { calculateAge } from "@/lib/utils/age";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { DeleteStudentButton } from "./DeleteStudentTableButton";
import { ACTIVITIES } from "@/constants";

const LEVEL_LABELS = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
} as const;

interface StudentRowProps {
  student: StudentSerialized;
}

export function StudentRow({ student }: StudentRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const age = calculateAge(student.birthDate);
  const guardian = student.guardians?.[0];
  const enrollments = student.enrollments ?? [];

  return (
    <TableRow
      className={`
        border-b border-border last:border-0 transition-all duration-200
        ${
          isDeleting
            ? "opacity-50 pointer-events-none bg-muted/30"
            : "hover:bg-muted/20"
        }
      `}
      aria-busy={isDeleting}
      aria-label={isDeleting ? `جاري حذف ${student.name}...` : undefined}
    >
      {/* Name + Avatar */}
      <TableCell className="pr-4 py-3">
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
          <Link
            href={`/dashboard/students/${student._id}`}
            className="font-medium text-sm text-foreground hover:text-primary transition-colors"
            tabIndex={isDeleting ? -1 : 0}
          >
            {student.name}
          </Link>
        </div>
      </TableCell>

      {/* Age */}
      <TableCell className="text-sm text-muted-foreground py-3">
        {age !== null ? `${age} سنة` : "—"}
      </TableCell>

      {/* Level */}
      <TableCell className="py-3">
        <Badge
          variant={
            student.level === "advanced"
              ? "default"
              : student.level === "intermediate"
                ? "outline"
                : "secondary"
          }
          className="text-xs"
        >
          {LEVEL_LABELS[student.level]}
        </Badge>
      </TableCell>

      {/* Enrollments */}
      <TableCell className="py-3">
        {enrollments.length === 0 ? (
          <span className="text-muted-foreground text-xs">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {enrollments.map((act) => (
              <Badge
                key={act}
                variant="outline"
                className="text-[10px] px-1.5 py-0"
              >
                {ACTIVITIES.labels[act]}
              </Badge>
            ))}
          </div>
        )}
      </TableCell>

      {/* Guardian */}
      <TableCell className="py-3">
        {guardian ? (
          <div>
            <p className="text-xs text-muted-foreground">{guardian.relation}</p>
            <p className="text-xs" dir="ltr">
              {guardian.phone}
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="pl-4 py-3">
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
            id={student._id}
            name={student.name}
            onPendingChange={setIsDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
