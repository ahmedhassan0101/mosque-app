// src/components/groups/GroupCard.tsx
import Link from "next/link";
import { GraduationCap, Users, Calendar, Eye, Pencil } from "lucide-react";

import type { GroupListItem } from "@/lib/data/group.data";
import type { ActivityType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteGroupAlert } from "./DeleteGroupAlert";

interface GroupCardProps {
  group: GroupListItem;
  type: ActivityType;
}

export function GroupCard({ group, type }: GroupCardProps) {
  const isTeacherMissing = group.teacherName === "غير محدد";

  return (
    <article className="group flex flex-col border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-l from-primary/60 to-primary" />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Name + Badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight">
            {group.name}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {group.studentCount} طالب
          </Badge>
        </div>

        {/* Meta */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {/* Teacher */}
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="shrink-0" />
            {isTeacherMissing ? (
              <span className="text-destructive/70 text-xs">
                المعلم محذوف
              </span>
            ) : (
              <span>{group.teacherName}</span>
            )}
          </div>

          {/* Student count */}
          <div className="flex items-center gap-2">
            <Users size={14} className="shrink-0" />
            <span>{group.studentCount} طالب مقيّد</span>
          </div>

          {/* Schedule */}
          {group.appointment && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0" />
              <span className="line-clamp-1">{group.appointment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 px-4 py-2 border-t border-border bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label={`عرض تفاصيل ${group.name}`}
        >
          <Link href={`/dashboard/groups/${type}/${group._id}`}>
            <Eye size={15} />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label={`تعديل ${group.name}`}
        >
          <Link href={`/dashboard/groups/${type}/${group._id}/edit`}>
            <Pencil size={15} />
          </Link>
        </Button>

        <DeleteGroupAlert id={group._id} name={group.name} type={type} />
      </div>
    </article>
  );
}