// src/app/(dashboard)/dashboard/students/TableFilters.tsx
"use client";

/**
 * TableFilters — Client Component
 *
 * Owns all filter UI state and syncs it to the URL via nuqs.
 *
 * Interview explanation:
 * - nuqs reads/writes URL search params in a type-safe way.
 * - shallow: false tells nuqs to trigger a full server re-render (RSC),
 *   not just a client-side navigation. This is what causes the Server Component
 *   above to re-fetch with the new filter values.
 * - The name search is debounced at 400ms so we don't fire a server request
 *   on every single keystroke — only after the user pauses typing.
 * - useTransition gives us isPending to show a loading indicator while the
 *   server is re-fetching, without blocking the UI.
 */

import { useTransition } from "react";
import {
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";
import { useDebouncedCallback } from "use-debounce";
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
import {
  ACTIVITIES,
  type ActivityType,
  LEVELS,
  type levelType,
} from "@/constants";


export function TableFilters() {
  const [isPending, startTransition] = useTransition();

  // nuqs manages all filter params as a single unit
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
      page: parseAsInteger.withDefault(1),
    },
    {
      startTransition, // nuqs uses this internally to mark navigation as non-urgent
      shallow: false, // triggers RSC re-render — this is the key to server filtering
    },
  );

  /**
   * Debounced search: waits 400ms after the user stops typing before
   * updating the URL. This prevents a server request on every keystroke.
   * We also reset page to 1 so the user sees results from the beginning.
   */
  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters({ query: value || null, page: null });
    // Object literal may only specify known properties, and 'page' does not exist in type 'Partial<{ query: string | null; level: NonNullable<"beginner" | "intermediate" | "advanced" | "all" | null> | null; activity: NonNullable<"all" | "quran" | "tarbiya" | "tajweed" | "maqraa" | "playground" | null> | null; }> | UpdaterFn<...>'.
  }, 400);

  const handleLevelChange = (value: string) => {
    setFilters({
      level: value === "all" ? null : (value as levelType),
      page: null,
    });
  };

  const handleActivityChange = (value: string) => {
    setFilters({
      activity: value === "all" ? null : (value as ActivityType),
      page: null,
    });
  };

  const hasActiveFilters =
    filters.query ||
    (filters.level && filters.level !== "all") ||
    (filters.activity && filters.activity !== "all");

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      dir="rtl"
      role="search"
      aria-label="فلترة الطلاب"
    >
      {/* Name search with debounce */}
      <div className="relative flex-1 max-w-xs">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isPending ? (
            <Loader2 size={14} className="text-muted-foreground animate-spin" />
          ) : (
            <Search size={14} className="text-muted-foreground" />
          )}
        </span>
        <Input
          defaultValue={filters.query ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ابحث باسم الطالب..."
          className="pr-9"
          aria-label="البحث باسم الطالب"
        />
      </div>

      {/* Level filter */}
      <Select value={filters.level ?? "all"} onValueChange={handleLevelChange}>
        <SelectTrigger className="w-36" aria-label="فلترة حسب المستوى">
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
        value={filters.activity ?? "all"}
        onValueChange={handleActivityChange}
      >
        <SelectTrigger className="w-36" aria-label="فلترة حسب النشاط">
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
          onClick={() =>
            setFilters({ query: null, level: null, activity: null, page: null })
          }
          aria-label="مسح جميع الفلاتر"
        >
          <X size={14} className="ml-1" />
          مسح
        </Button>
      )}
    </div>
  );
}
