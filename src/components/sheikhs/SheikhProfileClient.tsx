"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Badge }    from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Phone,
  Users,
  //  User,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ACT_MAP: Record<string, { label: string; color: string }> = {
  quran: {
    label: "القرآن",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  tarbiya: {
    label: "التربية",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  tajweed: {
    label: "التجويد",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  maqraa: {
    label: "المقرأة",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  playground: {
    label: "الملعب",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const LEVEL_MAP: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

interface Student {
  _id: string;
  name: string;
  level: string;
  photo?: string | null;
}
interface Group {
  _id: string;
  name: string;
  activity: string;
  students: Student[];
}
interface Sheikh {
  _id: string;
  name: string;
  phone?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
}

interface Props {
  data: { sheikh: Sheikh; groups: Group[] };
  sheikhId: string;
}

export function SheikhProfileClient({ data, sheikhId }: Props) {
  const { sheikh, groups } = data;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    groups.length === 1 ? groups[0]._id : null,
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Profile Header ── */}
      <div
        className="
        relative rounded-2xl overflow-hidden border border-border
        bg-gradient-to-br from-primary/5 via-background to-[var(--gold-light)]
      "
      >
        {/* Islamic pattern top bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-[var(--gold)] to-primary" />

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="
              relative w-20 h-20 rounded-2xl overflow-hidden shrink-0
              border-2 border-primary/20 bg-primary/8
              flex items-center justify-center shadow-sm
            "
            >
              {sheikh.photo ? (
                <Image
                  src={sheikh.photo}
                  alt={sheikh.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-primary/50">
                  {sheikh.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-xl font-bold">{sheikh.name}</h1>
              {sheikh.phone && (
                <a
                  href={`tel:${sheikh.phone}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
                  dir="ltr"
                >
                  <Phone size={13} />
                  {sheikh.phone}
                </a>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {groups.length > 0
                  ? `مسؤول عن ${groups.length} ${groups.length === 1 ? "مجموعة" : "مجموعات"}`
                  : "لا توجد مجموعات مرتبطة"}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/sheikhs/${sheikhId}/edit`}>
              <Pencil size={13} className="ml-1.5" />
              تعديل
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Groups ── */}
      {groups.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            المجموعات
          </h2>

          {groups.map((group) => {
            const act = ACT_MAP[group.activity];
            const isOpen = expandedGroup === group._id;
            const preview = group.students.slice(0, 4);
            const rest = group.students.length - preview.length;

            return (
              <Card key={group._id} className="overflow-hidden">
                {/* Group header — clickable to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedGroup(isOpen ? null : group._id)}
                  className="w-full text-right"
                >
                  <CardHeader className="pb-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                          <BookOpen size={16} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {group.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <Users size={11} />
                            {group.students.length} طالب
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {act && (
                          <span
                            className={`
                            text-xs font-medium px-2.5 py-1 rounded-full border
                            ${act.color}
                          `}
                          >
                            {act.label}
                          </span>
                        )}
                        {isOpen ? (
                          <ChevronUp
                            size={16}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </button>

                {/* Expandable students list */}
                {isOpen && (
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-1 gap-1.5">
                      {group.students.map((student) => (
                        <Link
                          key={student._id}
                          href={`/students/${student._id}`}
                          className="
                            flex items-center gap-3 px-3 py-2 rounded-lg
                            hover:bg-muted/50 transition-colors
                          "
                        >
                          <div
                            className="
                            w-8 h-8 rounded-full overflow-hidden shrink-0
                            bg-muted flex items-center justify-center
                          "
                          >
                            {student.photo ? (
                              <Image
                                src={student.photo}
                                alt={student.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground">
                                {student.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {student.name}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {LEVEL_MAP[student.level] ?? student.level}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {groups.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Users
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-sm text-muted-foreground">
              لا توجد مجموعات مرتبطة بهذا الشيخ
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {sheikh.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              ملاحظات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {sheikh.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-center text-muted-foreground">
        تسجيل في{" "}
        {new Date(sheikh.createdAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
