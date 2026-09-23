// src/app/(dashboard)/dashboard/students/page.tsx
import Link from "next/link";
import { Upload } from "lucide-react";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Button } from "@/components/ui/button";
import {
  getStudentsList,
  getStudentsOverview,
} from "@/queries/student.queries";
import { StudentsStats } from "@/components/students/StudentsStatsCards";
import { TableFilters } from "@/components/students/table/TableFilters";
import { StudentsTable } from "@/components/students/StudentsTable";
import type { ActivityType, levelType } from "@/constants";
import { ListPageHeader } from "@/components/shared/ListPageHeader";
import { StudentsExplorer } from "@/components/students/StudentsExplorer";

export const metadata: Metadata = { title: "قائمة الطلاب" };

type PageProps = {
  searchParams: Promise<{
    query?: string;
    level?: string;
    activity?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [overview, list] = await Promise.all([
    getStudentsOverview(),
    getStudentsList({
      query: params.query,
      level: params.level as levelType | "all",
      activity: params.activity as ActivityType | "all",
      page: currentPage,
      sortBy: params.sortBy as "name" | "birthDate" | "createdAt",
      sortOrder: params.sortOrder as "asc" | "desc",
    }),
  ]);

  return (
    // NuqsAdapter is required at the boundary where nuqs Client Components are used

    <NuqsAdapter>
      <div className="container-fluid" dir="rtl">
        {/* ── Header ── */}
        <ListPageHeader
          title="الطلاب"
          description="إدارة بيانات الطلاب المسجّلين"
          primaryAction={{
            label: "تسجيل طالب",
            href: "/dashboard/students/new",
          }}
        >
          <Button variant="outline" asChild>
            <Link href="/dashboard/students/import">
              <Upload size={16} className="me-2" />
              استيراد
            </Link>
          </Button>
        </ListPageHeader>

        <StudentsStats
          totalCount={overview.totalCount}
          activeCount={overview.activeCount}
          activityStats={overview.activityStats}
        />
        <StudentsExplorer
          students={list.students}
          totalCount={list.totalCount}
          totalPages={list.totalPages}
          currentPage={currentPage}
        />
      </div>
    </NuqsAdapter>
  );
}

// const hasActiveFilters = !!(
//   params.query ||
//   (params.level && params.level !== "all") ||
//   (params.activity && params.activity !== "all")
// );

// <StudentsStats
//   totalCount={overview.totalCount}
//   activeCount={overview.activeCount}
//   activityStats={overview.activityStats}
// />

{
  /* <StudentsExplorer
  students={list.students}
  totalCount={list.totalCount}
  totalPages={list.totalPages}
  currentPage={currentPage}
/>; */
}
// <TableFilters />

// <StudentsTable
//   students={list.students}
//   totalCount={list.totalCount}
//   totalPages={list.totalPages}
//   currentPage={currentPage}
//   hasActiveFilters={hasActiveFilters}
// />
