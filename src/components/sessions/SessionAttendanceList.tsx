// src/components/sessions/SessionAttendanceList.tsx — unchanged logic, minor cleanup
"use client";

import { useCallback } from "react";
import { Users, CheckSquare, Square } from "lucide-react";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { SessionInput } from "@/schemas/session.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttendanceStudents } from "@/hooks/use-attendance-students";

interface SessionAttendanceListProps {
  groupIds: string[];
  getValue: UseFormGetValues<SessionInput>;
  setValue: UseFormSetValue<SessionInput>;
  error?: string;
}

export function SessionAttendanceList({
  groupIds,
  getValue,
  setValue,
  error,
}: SessionAttendanceListProps) {
  const { students, isLoading } = useAttendanceStudents(groupIds);

  const attended = getValue("attendedStudentIds") ?? [];

  const toggleStudent = useCallback(
    (studentId: string, checked: boolean) => {
      const current = getValue("attendedStudentIds") ?? [];
      const updated = checked
        ? [...current, studentId]
        : current.filter((id) => id !== studentId);
      setValue("attendedStudentIds", updated, { shouldValidate: true });
    },
    [getValue, setValue],
  );

  const toggleAll = useCallback(() => {
    const allSelected = attended.length === students.length && students.length > 0;
    setValue(
      "attendedStudentIds",
      allSelected ? [] : students.map((s) => s._id),
      { shouldValidate: true },
    );
  }, [attended.length, students, setValue]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-2 p-4 rounded-xl border border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-xl text-center">
        <Users size={24} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          اختر مجموعة أولاً لعرض قائمة الطلاب
        </p>
      </div>
    );
  }

  const allSelected = students.length > 0 && attended.length === students.length;

  // ── List ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3 p-5 rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-sm font-semibold text-muted-foreground">
          الحضور ({attended.length} / {students.length})
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleAll}
          className="text-xs h-7"
        >
          {allSelected ? (
            <><Square size={13} className="ml-1.5" />إلغاء الكل</>
          ) : (
            <><CheckSquare size={13} className="ml-1.5" />تحديد الكل</>
          )}
        </Button>
      </div>

      {/* Student checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {students.map((student) => {
          const isChecked = attended.includes(student._id);
          return (
            <label
              key={student._id}
              htmlFor={`student-${student._id}`}
              className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors select-none ${
                isChecked
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <Checkbox
                id={`student-${student._id}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  toggleStudent(student._id, checked === true)
                }
              />
              <span className="text-sm font-medium">{student.name}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}