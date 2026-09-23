// src/components/students/StudentRow.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Pencil, Loader2 } from "lucide-react";

import type { StudentSerialized } from "@/types/serialized";
import { calculateAge } from "@/lib/utils/age";
import { cn } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteStudentMenuItem } from "./DeleteStudentMenuItem";
import { ACTIVITIES } from "@/constants";

const LEVEL_LABELS = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
} as const;

const VISIBLE_ACTIVITIES = 2;
const VISIBLE_GUARDIANS = 1;

interface StudentRowProps {
  student: StudentSerialized;
}

export function StudentRow({ student }: StudentRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const age = calculateAge(student.birthDate);
  const guardians = student.guardians ?? [];
  const enrollments = student.enrollments ?? [];
  const detailHref = `/dashboard/students/${student._id}`;

  const visibleActivities = enrollments.slice(0, VISIBLE_ACTIVITIES);
  const hiddenActivities = enrollments.slice(VISIBLE_ACTIVITIES);
  const visibleGuardians = guardians.slice(0, VISIBLE_GUARDIANS);
  const hiddenGuardians = guardians.slice(VISIBLE_GUARDIANS);

  function goToDetail() {
    if (isDeleting) return;
    router.push(detailHref);
  }

  // Needed because Popover/DropdownMenu content is portaled in the DOM
  // but still bubbles clicks through the React tree — without this, a
  // click inside either one would also trigger the row's navigation.
  function stopRowClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  return (
    <TableRow
      onClick={goToDetail}
      className={cn(
        "border-b border-border transition-all duration-200 last:border-0",
        isDeleting
          ? "pointer-events-none select-none opacity-60 blur-[1.5px]"
          : "cursor-pointer hover:bg-muted/20",
      )}
      aria-busy={isDeleting}
      aria-label={isDeleting ? `جاري حذف ${student.name}...` : undefined}
    >
      {/* Name + Avatar + Status */}
      <TableCell className="py-3 pe-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            {student.image ? (
              <Image
                src={student.image}
                alt={student.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-primary">
                {student.name[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={detailHref}
              onClick={stopRowClick}
              tabIndex={isDeleting ? -1 : 0}
              className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {student.name}
            </Link>
            {/* عدّل اسم الحقل لو مختلف عن isActive في StudentSerialized */}
            <span
              className={cn(
                "badge-base",
                student.isActive ? "badge-success" : "badge-neutral",
              )}
            >
              {student.isActive ? "نشط" : "متوقف"}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Age */}
      <TableCell className="py-3 text-sm text-muted-foreground">
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

      {/* Activities: first 2 + "+N" popover for the rest */}
      <TableCell className="py-3">
        {enrollments.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            {visibleActivities.map((act) => (
              <Badge
                key={act}
                variant="outline"
                className="px-1.5 py-0 text-[11px]"
              >
                {ACTIVITIES.labels[act]}
              </Badge>
            ))}
            {hiddenActivities.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={stopRowClick}
                    className="rounded-sm px-1 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    +{hiddenActivities.length}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  onClick={stopRowClick}
                  align="start"
                  className="w-auto"
                >
                  <div className="flex flex-col gap-1.5">
                    {hiddenActivities.map((act) => (
                      <Badge
                        key={act}
                        variant="outline"
                        className="w-fit text-[11px]"
                      >
                        {ACTIVITIES.labels[act]}
                      </Badge>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </TableCell>

      {/* Guardian: first + "+N" popover for the rest */}
      <TableCell className="py-3">
        {guardians.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <div>
              <p className="text-xs text-muted-foreground">
                {visibleGuardians[0].relation}
              </p>
              <p className="text-xs" dir="ltr">
                {visibleGuardians[0].phone}
              </p>
            </div>
            {hiddenGuardians.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={stopRowClick}
                    className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    +{hiddenGuardians.length}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  onClick={stopRowClick}
                  align="start"
                  className="w-auto"
                >
                  <div className="flex flex-col gap-2">
                    {hiddenGuardians.map((g, i) => (
                      <div key={i}>
                        <p className="text-xs text-muted-foreground">
                          {g.relation}
                        </p>
                        <p className="text-xs" dir="ltr">
                          {g.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 ps-4">
        {isDeleting ? (
          <div className="flex justify-end">
            <Loader2 size={15} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopRowClick}
                aria-label={`إجراءات ${student.name}`}
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={stopRowClick}>
              <DropdownMenuItem asChild>
                <Link href={`${detailHref}/edit`}>
                  <Pencil size={14} className="me-2" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DeleteStudentMenuItem
                id={student._id}
                name={student.name}
                onPendingChange={setIsDeleting}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
