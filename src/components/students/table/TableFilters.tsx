// // src/app/(dashboard)/dashboard/students/TableFilters.tsx
// "use client";

// /**
//  * TableFilters — Client Component
//  *
//  * Owns all filter UI state and syncs it to the URL via nuqs.
//  *
//  * Interview explanation:
//  * - nuqs reads/writes URL search params in a type-safe way.
//  * - shallow: false tells nuqs to trigger a full server re-render (RSC),
//  *   not just a client-side navigation. This is what causes the Server Component
//  *   above to re-fetch with the new filter values.
//  * - The name search is debounced at 400ms so we don't fire a server request
//  *   on every single keystroke — only after the user pauses typing.
//  * - useTransition gives us isPending to show a loading indicator while the
//  *   server is re-fetching, without blocking the UI.
//  */

// import { useTransition } from "react";
// import {
//   useQueryStates,
//   parseAsString,
//   parseAsStringEnum,
//   parseAsInteger,
// } from "nuqs";
// import { useDebouncedCallback } from "use-debounce";
// import { Search, Loader2, X } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   ACTIVITIES,
//   type ActivityType,
//   LEVELS,
//   type levelType,
// } from "@/constants";

// export function TableFilters() {
//   const [isPending, startTransition] = useTransition();

//   // nuqs manages all filter params as a single unit
//   const [filters, setFilters] = useQueryStates(
//     {
//       query: parseAsString.withDefault(""),
//       level: parseAsStringEnum([...LEVELS.values, "all"] as const).withDefault(
//         "all",
//       ),
//       activity: parseAsStringEnum([
//         ...ACTIVITIES.values,
//         "all",
//       ] as const).withDefault("all"),
//       page: parseAsInteger.withDefault(1),
//     },
//     {
//       startTransition, // nuqs uses this internally to mark navigation as non-urgent
//       shallow: false, // triggers RSC re-render — this is the key to server filtering
//     },
//   );

//   /**
//    * Debounced search: waits 400ms after the user stops typing before
//    * updating the URL. This prevents a server request on every keystroke.
//    * We also reset page to 1 so the user sees results from the beginning.
//    */
//   const handleSearch = useDebouncedCallback((value: string) => {
//     setFilters({ query: value || null, page: null });
//     // Object literal may only specify known properties, and 'page' does not exist in type 'Partial<{ query: string | null; level: NonNullable<"beginner" | "intermediate" | "advanced" | "all" | null> | null; activity: NonNullable<"all" | "quran" | "tarbiya" | "tajweed" | "maqraa" | "playground" | null> | null; }> | UpdaterFn<...>'.
//   }, 400);

//   const handleLevelChange = (value: string) => {
//     setFilters({
//       level: value === "all" ? null : (value as levelType),
//       page: null,
//     });
//   };

//   const handleActivityChange = (value: string) => {
//     setFilters({
//       activity: value === "all" ? null : (value as ActivityType),
//       page: null,
//     });
//   };

//   const hasActiveFilters =
//     filters.query ||
//     (filters.level && filters.level !== "all") ||
//     (filters.activity && filters.activity !== "all");

//   return (
//     <div
//       className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
//       dir="rtl"
//       role="search"
//       aria-label="فلترة الطلاب"
//     >
//       {/* Name search with debounce */}
//       <div className="relative flex-1 max-w-xs">
//         <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           {isPending ? (
//             <Loader2 size={14} className="text-muted-foreground animate-spin" />
//           ) : (
//             <Search size={14} className="text-muted-foreground" />
//           )}
//         </span>
//         <Input
//           defaultValue={filters.query ?? ""}
//           onChange={(e) => handleSearch(e.target.value)}
//           placeholder="ابحث باسم الطالب..."
//           className="pr-9"
//           aria-label="البحث باسم الطالب"
//         />
//       </div>

//       {/* Level filter */}
//       <Select value={filters.level ?? "all"} onValueChange={handleLevelChange}>
//         <SelectTrigger className="w-36" aria-label="فلترة حسب المستوى">
//           <SelectValue placeholder="المستوى" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">كل المستويات</SelectItem>
//           {LEVELS.values.map((lvl) => (
//             <SelectItem key={lvl} value={lvl}>
//               {LEVELS.labels[lvl]}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Activity filter */}
//       <Select
//         value={filters.activity ?? "all"}
//         onValueChange={handleActivityChange}
//       >
//         <SelectTrigger className="w-36" aria-label="فلترة حسب النشاط">
//           <SelectValue placeholder="النشاط" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">كل الأنشطة</SelectItem>
//           {ACTIVITIES.values.map((act) => (
//             <SelectItem key={act} value={act}>
//               {ACTIVITIES.labels[act]}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Clear all filters */}
//       {hasActiveFilters && (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() =>
//             setFilters({ query: null, level: null, activity: null, page: null })
//           }
//           aria-label="مسح جميع الفلاتر"
//         >
//           <X size={14} className="ml-1" />
//           مسح
//         </Button>
//       )}
//     </div>
//   );
// }
// src/app/(dashboard)/dashboard/students/TableFilters.tsx
"use client";

/**
 * TableFilters — Client Component
 *
 * Owns all filter UI state and syncs it to the URL via nuqs.
 *
 * - shallow: false triggers a full server re-render (RSC), not just a
 *   client-side navigation — that's what makes the page above re-fetch.
 * - Name search is debounced at 400ms so we don't fire a request on
 *   every keystroke, only once the user pauses typing.
 * - useTransition marks the nuqs-driven navigation as non-urgent, so
 *   React keeps the current table on screen (dimmed via isPending)
 *   instead of unmounting it while the new data streams in.
 */

import { useEffect, useState, useTransition } from "react";
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
      startTransition,
      shallow: false,
    },
  );

  // FIX: the search input used to be uncontrolled (defaultValue), so
  // clicking "clear all" reset the Selects but left typed text sitting
  // in the search box untouched. Local state gives instant typing
  // feedback; the effect keeps it in sync with external resets
  // (clear button, browser back/forward).
  const [searchValue, setSearchValue] = useState(filters.query);
  useEffect(() => {
    setSearchValue(filters.query);

    // Error: Calling setState synchronously within an effect can trigger cascading renders

    // Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
    // * Update external systems with the latest state from React.
    // * Subscribe for updates from some external system, calling setState in a callback function when external state changes.

    // Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

    // H:\mosque-app\src\components\students\table\TableFilters.tsx:242:5
    //   240 |   const [searchValue, setSearchValue] = useState(filters.query);
    //   241 |   useEffect(() => {
    // > 242 |     setSearchValue(filters.query);
    //       |     ^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
    //   243 |   }, [filters.query]);
    //   244 |
    //   245 |   const handleSearch = useDebouncedCallback((value: string) => {
  }, [filters.query]);

  const handleSearch = useDebouncedCallback((value: string) => {
    // Functional updater form — avoids a known nuqs type-inference issue
    // when only some of the managed keys are included in a plain object.
    setFilters((old) => ({ ...old, query: value || null, page: null }));
  }, 400);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  }

  const handleLevelChange = (value: string) => {
    setFilters((old) => ({
      ...old,
      level: value === "all" ? null : (value as levelType),
      page: null,
    }));
  };

  const handleActivityChange = (value: string) => {
    setFilters((old) => ({
      ...old,
      activity: value === "all" ? null : (value as ActivityType),
      page: null,
    }));
  };

  const handleClear = () => {
    setFilters((old) => ({
      ...old,
      query: null,
      level: null,
      activity: null,
      page: null,
    }));
  };

  const hasActiveFilters =
    filters.query ||
    (filters.level && filters.level !== "all") ||
    (filters.activity && filters.activity !== "all");

  return (
    <div
      className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
      dir="rtl"
      role="search"
      aria-label="فلترة الطلاب"
    >
      {/* Name search with debounce */}
      <div className="relative max-w-xs flex-1">
        <span className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2">
          {isPending ? (
            <Loader2 size={15} className="animate-spin text-muted-foreground" />
          ) : (
            <Search size={15} className="text-muted-foreground" />
          )}
        </span>
        <Input
          value={searchValue}
          onChange={onSearchChange}
          placeholder="ابحث باسم الطالب..."
          className="ps-9"
          aria-label="البحث باسم الطالب"
        />
      </div>

      {/* Level filter */}
      <Select value={filters.level ?? "all"} onValueChange={handleLevelChange}>
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
        value={filters.activity ?? "all"}
        onValueChange={handleActivityChange}
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
          onClick={handleClear}
          aria-label="مسح جميع الفلاتر"
        >
          <X size={14} className="me-1" />
          مسح
        </Button>
      )}
    </div>
  );
}
