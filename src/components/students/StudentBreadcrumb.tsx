// src/components/students/StudentBreadcrumb.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentProfile } from "@/queries/student.queries";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface StudentBreadcrumbProps {
  id: string;
}

/**
 * Renders inside the same <Suspense> boundary as StudentProfileContent,
 * calling the exact same getStudentProfile(id) — cache() collapses both
 * into a single DB round trip within the request.
 */
export async function StudentBreadcrumb({ id }: StudentBreadcrumbProps) {
  const data = await getStudentProfile(id);
  if (!data) notFound();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">الرئيسية</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard/students">الطلاب</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-45 truncate">
            {data.student.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
