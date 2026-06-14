// src/app/(dashboard)/dashboard/teachers/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import type { Metadata } from "next";

import { getTeacherById } from "@/queries/teacher.queries";
import { TeacherProfileContent } from "@/components/teachers/TeacherProfileContent";
import { TeacherProfileSkeleton } from "@/components/teachers/TeacherProfileSkeleton";

type TeacherProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: TeacherProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  // React cache() deduplicates this call with the one inside TeacherProfileContent
  const teacher = await getTeacherById(id);
  return { title: teacher ? `ملف: ${teacher.name}` : "المعلم" };
}

export default async function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  const { id } = await params;
  // Pre-fetch for breadcrumb name — deduplicated by React cache()
  const teacher = await getTeacherById(id);

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6" dir="rtl">
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Home size={13} />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft size={13} className="rotate-180" />
        <Link
          href="/dashboard/teachers"
          className="hover:text-foreground transition-colors"
        >
          المعلمون
        </Link>
        <ChevronLeft size={13} className="rotate-180" />
        <span className="text-foreground font-medium truncate max-w-45">
          {teacher?.name ?? "الملف الشخصي"}
        </span>
      </nav>

      {/* ── Profile content — streamed ── */}
      <Suspense fallback={<TeacherProfileSkeleton />}>
        <TeacherProfileContent id={id} />
      </Suspense>
    </main>
  );
}
