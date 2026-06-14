"use client"

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
type SortableColumn = "name" | "birthDate";
interface StudentsTableHeaderProps {
  sortBy: string;
  sortOrder: string;
  onSort: (column: SortableColumn) => void;
}

function SortIcon({
  column,
  currentSort,
  currentOrder,
}: {
  column: SortableColumn;
  currentSort: string;
  currentOrder: string;
}) {
  if (currentSort !== column)
    return <ArrowUpDown size={12} className="text-muted-foreground/50" />;
  return currentOrder === "asc" ? (
    <ArrowUp size={12} className="text-primary" />
  ) : (
    <ArrowDown size={12} className="text-primary" />
  );
}

export default function StudentsTableHeader({
  sortBy,
  sortOrder,
  onSort,
}: StudentsTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        {/* Sortable: Name */}
        <TableHead className="text-right pr-4">
          <button
            onClick={() => onSort("name")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="ترتيب حسب الاسم"
          >
            الطالب
            <SortIcon
              column="name"
              currentSort={sortBy}
              currentOrder={sortOrder}
            />
          </button>
        </TableHead>

        {/* Sortable: Age (via birthDate) */}
        <TableHead className="text-right">
          <button
            onClick={() => onSort("birthDate")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="ترتيب حسب العمر"
          >
            العمر
            <SortIcon
              column="birthDate"
              currentSort={sortBy}
              currentOrder={sortOrder}
            />
          </button>
        </TableHead>

        <TableHead className="text-right text-xs font-medium text-muted-foreground">
          المستوى
        </TableHead>
        <TableHead className="text-right text-xs font-medium text-muted-foreground">
          الأنشطة
        </TableHead>
        <TableHead className="text-right text-xs font-medium text-muted-foreground">
          ولي الأمر
        </TableHead>
        <TableHead className="text-right pl-4">
          <span className="sr-only">إجراءات</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
