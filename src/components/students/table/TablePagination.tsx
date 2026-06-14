"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  totalCount,
  totalPages,
  currentPage,
  isPending,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-1" dir="rtl">
      <p className="text-xs text-muted-foreground">
        {totalCount} طالب · صفحة {currentPage} من {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={14} />
        </Button>

        {/* Page numbers — show max 5 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
          )
          .reduce<(number | "...")[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span
                key={`d-${idx}`}
                className="px-1 text-muted-foreground text-xs"
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => onPageChange(item as number)}
                disabled={isPending}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`الصفحة ${item}`}
              >
                {item}
              </Button>
            ),
          )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={14} />
        </Button>
      </div>
    </div>
  );
}
