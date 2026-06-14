// src/components/students/table/TablePagination.tsx
"use client";

import { useTransition } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export function TablePagination({
  totalPages,
  totalCount,
  currentPage,
}: TablePaginationProps) {
  const [isPending, startTransition] = useTransition();
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ startTransition, shallow: false }),
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // Generate visible page numbers (max 5 around current)
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | "...")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1)
      rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3"
      dir="rtl"
    >
      {/* Count */}
      <p className="text-xs text-muted-foreground">
        إجمالي {totalCount} طالب · صفحة {currentPage} من {totalPages}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(1)}
          disabled={!canPrev || isPending}
          aria-label="الصفحة الأولى"
        >
          <ChevronsRight size={14} />
        </Button>

        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(currentPage - 1)}
          disabled={!canPrev || isPending}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={14} />
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) =>
          pageNum === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-1 text-muted-foreground text-sm"
            >
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => setPage(pageNum as number)}
              disabled={isPending}
              aria-label={`الصفحة ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageNum}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(currentPage + 1)}
          disabled={!canNext || isPending}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={14} />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPage(totalPages)}
          disabled={!canNext || isPending}
          aria-label="الصفحة الأخيرة"
        >
          <ChevronsLeft size={14} />
        </Button>
      </div>
    </div>
  );
}
