// src/app/(dashboard)/dashboard/students/[id]/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { getStudentProfile } from "@/queries/student.queries";
import { StudentBreadcrumb } from "@/components/students/StudentBreadcrumb";
import { StudentProfileContent } from "@/components/students/StudentProfileContent";
import { StudentProfileSkeleton } from "@/components/students/StudentProfileSkeleton";

interface StudentProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StudentProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getStudentProfile(id);
  return {
    title: data ? `${data.student.name} | الطلاب` : "طالب غير موجود",
  };
}

export default async function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { id } = await params;

  return (
    <div className="container-detail" dir="rtl">
      <Suspense fallback={<StudentProfileSkeleton />}>
        <StudentBreadcrumb id={id} />
        <StudentProfileContent id={id} />
      </Suspense>
    </div>
  );
}
// // src/app/(dashboard)/dashboard/students/[id]/page.tsx
// import { Suspense } from "react";
// import Link from "next/link";
// import { ChevronLeft, Home } from "lucide-react";
// import type { Metadata } from "next";

// import { getStudentById } from "@/queries/student.queries";
// import { StudentProfileContent } from "@/components/students/StudentProfileContent";
// import { StudentProfileSkeleton } from "@/components/students/StudentProfileSkeleton";
// import StudentDashboard from "../StudentProfile";

// type StudentProfilePageProps = {
//   params: Promise<{ id: string }>;
// };

// export async function generateMetadata({
//   params,
// }: StudentProfilePageProps): Promise<Metadata> {
//   const { id } = await params;
//   const student = await getStudentById(id);
//   return { title: student ? `ملف: ${student.name}` : "ملف الطالب" };
// }

// export default async function StudentProfilePage({
//   params,
// }: StudentProfilePageProps) {
//   const { id } = await params;
//   // Pre-fetch for breadcrumb — React cache() deduplicates with the call inside Content
//   const student = await getStudentById(id);

//   return (
//     <div className="container-detail" dir="rtl">
//       {/* ── Breadcrumb ── */}
//       <nav
//         aria-label="مسار التنقل"
//         className="flex items-center gap-1.5 text-sm text-muted-foreground"
//       >
//         <Link
//           href="/dashboard"
//           className="hover:text-foreground transition-colors flex items-center gap-1"
//         >
//           <Home size={13} />
//           <span>الرئيسية</span>
//         </Link>
//         <ChevronLeft size={13} className="rotate-180" />
//         <Link
//           href="/dashboard/students"
//           className="hover:text-foreground transition-colors"
//         >
//           الطلاب
//         </Link>
//         <ChevronLeft size={13} className="rotate-180" />
//         <span className="text-foreground font-medium truncate max-w-45">
//           {student?.name ?? "الملف الشخصي"}
//         </span>
//       </nav>
//       {/* ── Bento Grid — streamed ── */}
//       <Suspense fallback={<StudentProfileSkeleton />}>
//         <StudentProfileContent id={id} />
//       </Suspense>
//       <StudentDashboard/>
//     </div>
//   );
// }
