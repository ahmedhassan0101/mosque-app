// src/components/teacher/TeacherCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Phone, Users, Pencil, Eye } from "lucide-react";

import type { TeacherSerialized } from "@/types/serialized";
import { Button } from "@/temp/button";
import { DeleteTeacherButton } from "./DeleteTeacherButton";

interface TeacherCardProps {
  teacher: TeacherSerialized;
}

/**
 * A single teacher card for the list view.
 * Server Component — renders with no client JS.
 * Delete button is a separate Client Component island.
 */
export function TeacherCard({ teacher }: TeacherCardProps) {
  const initials = teacher.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <article className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* ── Top accent bar ── */}
      <div className="h-1 w-full bg-linear-to-l from-primary/60 to-primary" />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* ── Avatar + Name ── */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
            {teacher.image ? (
              <Image
                src={teacher.image}
                alt={teacher.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <span className="text-primary font-bold text-sm">{initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {teacher.name}
            </h3>
            {teacher.phone && (
              <p
                className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"
                dir="ltr"
              >
                <Phone size={11} />
                {teacher.phone}
              </p>
            )}
          </div>
        </div>

        {/* ── Notes ── */}
        {teacher.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {teacher.notes}
          </p>
        )}

        {/* ── Groups count ── */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
          <Users size={12} />
          <span>{teacher.groupIds?.length ?? 0} مجموعة</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-1 px-4 py-2 border-t border-border bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label={`عرض ملف ${teacher.name}`}
        >
          <Link href={`/dashboard/teachers/${teacher._id}`}>
            <Eye size={15} />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label={`تعديل ${teacher.name}`}
        >
          <Link href={`/dashboard/teachers/${teacher._id}/edit`}>
            <Pencil size={15} />
          </Link>
        </Button>

        <DeleteTeacherButton id={teacher._id.toString()} name={teacher.name} />
      </div>
    </article>
  );
}
