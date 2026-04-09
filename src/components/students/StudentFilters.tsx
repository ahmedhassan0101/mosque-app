/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/students/StudentFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useTransition } from "react";

const ACTIVITIES = [
  { label: "الكل", value: "" },
  { label: "قرآن", value: "quran" },
  { label: "تربية", value: "tarbiya" },
  { label: "تجويد", value: "tajweed" },
  { label: "مقرأة", value: "maqraa" },
  { label: "ملعب", value: "playground" },

];

export function StudentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentActivity = searchParams.get("activity") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.set("page", "1"); 

    startTransition(() => {
      router.push(`/students?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="ابحث عن طالب..."
          className="pr-10 h-11 rounded-xl shadow-sm focus-visible:ring-emerald-500"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

{/* <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {s.enrollments.map((act) => {
                          const config = ACTIVITY_LABELS[act];
                          if (config) {
                            return (
                              <Badge
                                key={act}
                                variant="secondary"
                                className={`${config.bg} ${config.text} border-none font-medium hover:bg-opacity-80`}
                              >
                                {config.label}
                              </Badge>
                            );
                          }
                          return (
                            <Badge
                              key={act}
                              variant="outline"
                              className="text-xs"
                            >
                              {act}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell> */}

      <div className="flex gap-2 flex-wrap">
        {ACTIVITIES.map((act) => (
          <Badge
            key={act.value}
            variant={currentActivity === act.value ? "default" : "outline"}
            className={`cursor-pointer px-4 py-1.5 rounded-lg transition-all ${
              currentActivity === act.value ? "bg-emerald-600 hover:bg-emerald-700 shadow-md scale-105" : "hover:border-emerald-200"
            }`}
            onClick={() => updateFilter("activity", act.value)}
          >
            {act.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}