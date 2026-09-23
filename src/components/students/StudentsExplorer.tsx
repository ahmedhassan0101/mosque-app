// src/components/students/StudentsExplorer.tsx
"use client";
import { useTransition } from "react";
import { Users, SearchX } from "lucide-react";
import {
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";
import {
  ACTIVITIES,
  type ActivityType,
  LEVELS,
  type levelType,
} from "@/constants";
import type { StudentSerialized } from "@/types/serialized";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { FiltersToolbar } from "./FiltersToolbar";
import { StudentsTable } from "./StudentsTable";
import { TablePagination } from "./TablePagination";

type SortableColumn = "name" | "birthDate";

interface StudentsExplorerProps {
  students: StudentSerialized[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * The single owner of all URL-driven state for this page: search text,
 * level/activity filters, sort, and pagination. One useQueryStates call,
 * one useTransition — every child below reads its isPending from here,
 * so the search spinner, the dimmed table, and the disabled pagination
 * buttons can never fall out of sync with each other.
 *
 * Children receive plain callbacks (setQuery, setLevel, ...) — none of
 * them import nuqs or know how the URL state is implemented.
 */
export function StudentsExplorer({
  students,
  totalCount,
  totalPages,
  currentPage,
}: StudentsExplorerProps) {
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      level: parseAsStringEnum([...LEVELS.values, "all"] as const).withDefault(
        "all",
      ),
      activity: parseAsStringEnum([
        ...ACTIVITIES.values,
        "all",
      ] as const).withDefault("all"),
      sortBy: parseAsStringEnum(["name", "birthDate"] as const).withDefault(
        "name",
      ),
      sortOrder: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
      page: parseAsInteger.withDefault(1),
    },
    {
      startTransition, // marks the URL update as non-urgent — keeps old UI visible
      shallow: false, // triggers the RSC re-fetch in page.tsx
    },
  );

  // ── Callbacks handed down to children — plain functions, no nuqs leakage ──

  function setQuery(value: string) {
    setFilters((old) => ({ ...old, query: value || null, page: null }));
  }

  function setLevel(value: levelType | "all") {
    setFilters((old) => ({
      ...old,
      level: value === "all" ? null : value,
      page: null,
    }));
  }

  function setActivity(value: ActivityType | "all") {
    setFilters((old) => ({
      ...old,
      activity: value === "all" ? null : value,
      page: null,
    }));
  }

  function setSort(column: SortableColumn) {
    setFilters((old) => ({
      ...old,
      sortBy: column,
      // clicking the same column again flips direction; a new column starts asc
      sortOrder:
        old.sortBy === column && old.sortOrder === "asc" ? "desc" : "asc",
      page: null,
    }));
  }

  function setPage(page: number) {
    setFilters((old) => ({ ...old, page: page === 1 ? null : page }));
  }

  function clearFilters() {
    setFilters((old) => ({
      ...old,
      query: null,
      level: null,
      activity: null,
      page: null,
    }));
  }

  const hasActiveFilters = !!(
    filters.query ||
    filters.level !== "all" ||
    filters.activity !== "all"
  );

  return (
    <Card>
      <CardHeader divider>
        <FiltersToolbar
          query={filters.query}
          level={filters.level}
          activity={filters.activity}
          onQueryChange={setQuery}
          onLevelChange={setLevel}
          onActivityChange={setActivity}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          isPending={isPending}
        />
      </CardHeader>

      <CardContent className="p-0">
        {students.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={SearchX}
              title="لا توجد نتائج مطابقة"
              description="جرّب تغيير معايير البحث أو الفلترة"
              action={{ label: "مسح الفلاتر", onClick: clearFilters }}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="لا يوجد طلاب مسجّلين بعد"
              description="ابدأ بتسجيل أول طالب في المسجد"
              action={{
                label: "تسجيل طالب جديد",
                href: "/dashboard/students/new",
              }}
            />
          )
        ) : (
          <StudentsTable
            students={students}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSort={setSort}
            isPending={isPending}
          />
        )}
      </CardContent>

      {totalPages > 1 && (
        <CardFooter>
          <TablePagination
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={currentPage}
            isPending={isPending}
            onPageChange={setPage}
          />
        </CardFooter>
      )}
    </Card>
  );
}
