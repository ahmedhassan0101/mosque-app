"use client"

import { Users } from "lucide-react";
import StudentsTableHeader from "./StudentsTableHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody } from "@/components/ui/table";
import { StudentRow } from "./StudentRow";
import TablePagination from "./TablePagination";
import { StudentSerialized } from "@/types/serialized";
import { useTransition } from "react";
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";
interface StudentsTableProps {
  students: StudentSerialized[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasActiveFilters: boolean;
}

type SortableColumn = "name" | "birthDate";
export function StudentsTable({
  students,
  totalCount,
  totalPages,
  currentPage,
  hasActiveFilters,
}: StudentsTableProps) {
  const [isPending, startTransition] = useTransition();

  const [params, setParams] = useQueryStates(
    {
      sortBy: parseAsStringEnum([
        "name",
        "birthDate",
        "createdAt",
      ] as const).withDefault("name"),
      sortOrder: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
      page: parseAsInteger.withDefault(1),
    },
    { startTransition, shallow: false },
  );

  /**
   * Header Sort Handler
   */
  const handleSort = (column: SortableColumn) => {
    if (params.sortBy === column) {
      setParams({
        sortOrder: params.sortOrder === "asc" ? "desc" : "asc",
        page: 1,
      });
    } else {
      setParams({ sortBy: column, sortOrder: "asc", page: 1 });
    }
  };

  /**
   * Pagination Handler (This is the function we pass down)
   */
  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
  };

  // ── Empty State ──
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">
          {hasActiveFilters ? "لا توجد نتائج مطابقة" : "لا يوجد طلاب بعد"}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {hasActiveFilters
            ? "جرّب تغيير معايير البحث أو الفلترة"
            : "ابدأ بتسجيل أول طالب في المسجد"}
        </p>
        {!hasActiveFilters && (
          <Button asChild size="sm">
            <Link href="/dashboard/students/new">تسجيل طالب</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 transition-opacity duration-200 ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* ── Table ── */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <Table dir="rtl">
          {/* Passed onSort function down to Header */}
          <StudentsTableHeader
            sortBy={params.sortBy}
            sortOrder={params.sortOrder}
            onSort={handleSort}
          />

          <TableBody>
            {students.map((student) => (
              <StudentRow key={student._id} student={student} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {/* Passed handlePageChange function down to Pagination */}
      <TablePagination
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        isPending={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
