// src/app/(dashboard)/dashboard/students/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import type { Metadata } from "next";

import { getStudentById } from "@/queries/student.queries";
import { StudentProfileContent } from "@/components/students/StudentProfileContent";
import { StudentProfileSkeleton } from "@/components/students/StudentProfileSkeleton";

type StudentProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: StudentProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudentById(id);
  return { title: student ? `ملف: ${student.name}` : "ملف الطالب" };
}

export default async function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { id } = await params;
  // Pre-fetch for breadcrumb — React cache() deduplicates with the call inside Content
  const student = await getStudentById(id);

  return (
    <div className="container-detail flex flex-col gap-6" dir="rtl">
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
          href="/dashboard/students"
          className="hover:text-foreground transition-colors"
        >
          الطلاب
        </Link>
        <ChevronLeft size={13} className="rotate-180" />
        <span className="text-foreground font-medium truncate max-w-45">
          {student?.name ?? "الملف الشخصي"}
        </span>
      </nav>
      {/* ── Bento Grid — streamed ── */}
      <Suspense fallback={<StudentProfileSkeleton />}>
        <StudentProfileContent id={id} />
      </Suspense>
    </div>
  );
}
