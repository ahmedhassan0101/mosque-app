// src/app/(dashboard)/dashboard/students/StudentsStats.tsx
import type { LucideIcon } from "lucide-react";
import {
  Users,
  UserCheck,
  BookOpen,
  Heart,
  Music,
  Award,
  Dumbbell,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { ACTIVITIES, type ActivityType } from "@/constants";

interface StudentsStatsProps {
  totalCount: number;
  activeCount: number;
  activityStats: Record<ActivityType, number>;
}

/*
  TODO(hardcoded): no natural source for this pairing in the logic yet.
  Icon + chart-token color per activity — move to @/constants alongside
  ACTIVITIES if the table's activity Popover ends up needing the same
  mapping later. Kept local for now since nothing else uses it.
*/
const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  quran: BookOpen,
  tarbiya: Heart,
  tajweed: Music,
  maqraa: Award,
  playground: Dumbbell,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  quran: "var(--chart-1)",
  tarbiya: "var(--chart-2)",
  tajweed: "var(--chart-3)",
  maqraa: "var(--chart-4)",
  playground: "var(--chart-5)",
};

/**
 * Server Component — receives pre-fetched stats as props.
 * No fetching here — data flows down from the page.
 */
export function StudentsStats({
  totalCount,
  activeCount,
  activityStats,
}: StudentsStatsProps) {
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      {/* Primary — the two numbers that matter most, given real card weight */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Users}
          label="إجمالي الطلاب"
          value={totalCount}
          hint="في المسجد"
        />
        <StatCard
          icon={UserCheck}
          label="الطلاب النشطون"
          value={activeCount}
          hint={inactiveCount > 0 ? `${inactiveCount} غير نشط` : undefined}
        />
      </div>

      {/* Secondary — activity breakdown as a lightweight chip row, not
          5 more full cards competing for attention. Always shows all
          5 categories, even at zero, so the set stays visually stable
          rather than reflowing based on which activities have students. */}
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.values.map((activity) => {
          const count = activityStats[activity] ?? 0;
          const Icon = ACTIVITY_ICONS[activity];

          return (
            <div
              key={activity}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5",
                count === 0 && "opacity-60",
              )}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    count > 0
                      ? ACTIVITY_COLORS[activity]
                      : "var(--muted-foreground)",
                }}
                aria-hidden="true"
              />
              <Icon size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {ACTIVITIES.labels[activity]}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon size={14} />
        {label}
      </div>
      <p className="text-stat-number mt-2">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
