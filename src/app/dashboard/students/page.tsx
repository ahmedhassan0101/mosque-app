// src/app/(dashboard)/dashboard/students/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentsList } from "@/queries/student.queries";
import { StudentsStats } from "@/components/students/StudentsStatsCards";
import { TableFilters } from "@/components/students/table/TableFilters";
import { StudentsTable } from "@/components/students/table/StudentsTable";
import type { ActivityType, levelType } from "@/constants";

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

/**
 * StudentsPage — Server Component (the orchestrator)
 *
 * This component:
 * 1. Reads URL search params (set by nuqs in the Client Components below).
 * 2. Passes them to the MongoDB fetcher.
 * 3. Passes the result to the rendering components.
 *
 * The flow:
 *   User changes filter → nuqs updates URL → Next.js re-renders this RSC
 *   → New params → New DB query → Fresh data → Table re-renders
 */
export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const result = await getStudentsList({
    query: params.query,
    level: params.level as levelType | "all",
    activity: params.activity as ActivityType | "all",
    page: currentPage,
    limit: 20,
    sortBy: params.sortBy as "name" | "birthDate" | "createdAt",
    sortOrder: params.sortOrder as "asc" | "desc",
  });

  const hasActiveFilters = !!(
    params.query ||
    (params.level && params.level !== "all") ||
    (params.activity && params.activity !== "all")
  );

  return (
    // NuqsAdapter is required at the boundary where nuqs Client Components are used
    <NuqsAdapter>
      <div className="container-fluid flex flex-col gap-6" dir="rtl">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">الطلاب</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              إدارة بيانات الطلاب المسجّلين
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/students/new">
              <Plus size={16} className="ml-2" />
              تسجيل طالب
            </Link>
          </Button>
        </div>

        {/* ── Stats (Server Component — renders immediately) ── */}
        <StudentsStats
          totalCount={result.totalCount}
          activeCount={result.activeCount}
          activityStats={result.activityStats}
        />

        {/* ── Filters (Client Component) ── */}
        <TableFilters />

        {/* ── Table ── */}
        <StudentsTable
          students={result.students}
          totalCount={result.totalCount}
          totalPages={result.totalPages}
          currentPage={currentPage}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </NuqsAdapter>
  );
}
