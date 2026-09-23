// src/components/students/FiltersToolbar.tsx
"use client";

import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedSearchInput } from "@/hooks/useDebouncedSearchInput";
import {
  ACTIVITIES,
  type ActivityType,
  LEVELS,
  type levelType,
} from "@/constants";

interface FiltersToolbarProps {
  query: string;
  level: levelType | "all";
  activity: ActivityType | "all";
  onQueryChange: (value: string) => void;
  onLevelChange: (value: levelType | "all") => void;
  onActivityChange: (value: ActivityType | "all") => void;
  hasActiveFilters: boolean;
  onClear: () => void;
  isPending: boolean;
}

/**
 * Pure presentational toolbar. Every value and every change handler
 * comes from StudentsExplorer via props — no URL/nuqs knowledge here,
 * so this component (or a near-identical copy) can serve the
 * Teachers/Groups list pages later with different prop values.
 */
export function FiltersToolbar({
  query,
  level,
  activity,
  onQueryChange,
  onLevelChange,
  onActivityChange,
  hasActiveFilters,
  onClear,
  isPending,
}: FiltersToolbarProps) {
  const search = useDebouncedSearchInput({
    value: query,
    onChange: onQueryChange,
  });

  return (
    <div
      className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
      dir="rtl"
      role="search"
      aria-label="فلترة الطلاب"
    >
      {/* Name search — stays typable even while pending, so the user can
          keep refining without waiting on the in-flight request */}
      <div className="relative max-w-xs flex-1">
        <span className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2">
          {isPending ? (
            <Loader2 size={15} className="animate-spin text-muted-foreground" />
          ) : (
            <Search size={15} className="text-muted-foreground" />
          )}
        </span>
        <Input
          {...search}
          placeholder="ابحث باسم الطالب..."
          className="ps-9"
          aria-label="البحث باسم الطالب"
        />
      </div>

      {/* Level filter */}
      <Select
        value={level}
        onValueChange={(v) => onLevelChange(v as levelType | "all")}
        disabled={isPending}
      >
        <SelectTrigger className="w-40" aria-label="فلترة حسب المستوى">
          <SelectValue placeholder="المستوى" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل المستويات</SelectItem>
          {LEVELS.values.map((lvl) => (
            <SelectItem key={lvl} value={lvl}>
              {LEVELS.labels[lvl]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Activity filter */}
      <Select
        value={activity}
        onValueChange={(v) => onActivityChange(v as ActivityType | "all")}
        disabled={isPending}
      >
        <SelectTrigger className="w-40" aria-label="فلترة حسب النشاط">
          <SelectValue placeholder="النشاط" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأنشطة</SelectItem>
          {ACTIVITIES.values.map((act) => (
            <SelectItem key={act} value={act}>
              {ACTIVITIES.labels[act]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isPending}
          aria-label="مسح جميع الفلاتر"
        >
          <X size={14} className="me-1" />
          مسح
        </Button>
      )}
    </div>
  );
}
