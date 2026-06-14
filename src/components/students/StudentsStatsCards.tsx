// src/app/(dashboard)/dashboard/students/StudentsStats.tsx
import {
  Users,
  UserCheck,
  BookOpen,
  Heart,
  Music,
  Award,
  Dumbbell,
} from "lucide-react";
import { ACTIVITIES, type ActivityType } from "@/constants";

interface StudentsStatsProps {
  totalCount: number;
  activeCount: number;
  activityStats: Record<ActivityType, number>;
}

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  quran: <BookOpen size={13} />,
  tarbiya: <Heart size={13} />,
  tajweed: <Music size={13} />,
  maqraa: <Award size={13} />,
  playground: <Dumbbell size={13} />,
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
  return (
    <div className="space-y-3" dir="rtl">
      {/* Row 1: Total + Active */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-xl bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Users size={13} />
            إجمالي الطلاب
          </div>
          <p className="text-2xl font-bold">{totalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">في المسجد</p>
        </div>

        <div className="border border-border rounded-xl bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <UserCheck size={13} />
            الطلاب النشطون
          </div>
          <p className="text-2xl font-bold">{activeCount}</p>
          {totalCount - activeCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount - activeCount} غير نشط
            </p>
          )}
        </div>
      </div>

      {/* Row 2: All activities — always show all 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ACTIVITIES.values.map((activity) => {
          const count = activityStats[activity] ?? 0;
          return (
            <div
              key={activity}
              className={`border rounded-xl bg-card p-3 transition-colors ${
                count > 0 ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                {ACTIVITY_ICONS[activity]}
                <span className="truncate">{ACTIVITIES.labels[activity]}</span>
              </div>
              <p className="text-xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
