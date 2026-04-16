// import { FormExamples } from "@/components/form/FormExamples";

// export default function Home() {
//   return (
//     <div>
//       <FormExamples />
//     </div>
//   );
// }
import type { Metadata } from "next";
import {
  Users,
  GraduationCap,
  BookOpen,
  Banknote,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";

export const metadata: Metadata = {
  title: "لوحة التحكم",
};

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  colorClass: string;
}

/* ─────────────────────────────────────────────
   Static data (replace with real server fetches)
───────────────────────────────────────────── */

const STATS: StatCard[] = [
  {
    label: "إجمالي الطلاب",
    value: "٢٤٨",
    change: "+١٢ هذا الشهر",
    positive: true,
    icon: Users,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    label: "المعلمون",
    value: "٣٢",
    change: "+٢ هذا الشهر",
    positive: true,
    icon: GraduationCap,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "الحلقات النشطة",
    value: "١٨",
    change: "بدون تغيير",
    positive: true,
    icon: BookOpen,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "الإيرادات (ريال)",
    value: "٤٨,٥٠٠",
    change: "+٨٪ من الشهر الماضي",
    positive: true,
    icon: Banknote,
    colorClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
];

const RECENT_ACTIVITIES = [
  { time: "منذ ٥ دقائق", text: "تم تسجيل طالب جديد: أحمد محمد الزهراني" },
  { time: "منذ ٢٠ دقيقة", text: "تم تحديث جدول حلقة تحفيظ القرآن" },
  { time: "منذ ساعة", text: "تمت إضافة فعالية: محاضرة علمية يوم الجمعة" },
  { time: "منذ ٣ ساعات", text: "تم استلام دفعة رسوم دراسية من ولي أمر" },
  { time: "منذ يوم", text: "تم تعيين معلم جديد في قسم التجويد" },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          مرحباً بك في لوحة التحكم
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          نظرة عامة على نشاط المسجد والمركز التعليمي
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={cn("rounded-lg p-2.5", stat.colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-(--success)">
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lower Grid ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="glass-card lg:col-span-2 rounded-xl p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            آخر الأنشطة
          </h3>
          <ul className="flex flex-col gap-3">
            {RECENT_ACTIVITIES.map((activity, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-xl p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            إجراءات سريعة
          </h3>
          <div className="flex flex-col gap-2">
            {[
              "تسجيل طالب جديد",
              "إضافة معلم",
              "إنشاء حلقة جديدة",
              "تسجيل دفعة مالية",
              "إضافة إعلان",
            ].map((action) => (
              <button
                key={action}
                type="button"
                className={cn(
                  "w-full rounded-lg px-4 py-2.5 text-sm font-medium text-start transition-colors",
                  "bg-muted hover:bg-accent text-foreground",
                  "focus-ring",
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            إجراءات سريعة
          </h3>
          <div className="flex flex-col gap-2">
            {[
              "تسجيل طالب جديد",
              "إضافة معلم",
              "إنشاء حلقة جديدة",
              "تسجيل دفعة مالية",
              "إضافة إعلان",
            ].map((action) => (
              <button
                key={action}
                type="button"
                className={cn(
                  "w-full rounded-lg px-4 py-2.5 text-sm font-medium text-start transition-colors",
                  "bg-muted hover:bg-accent text-foreground",
                  "focus-ring",
                )}
              >
                {action}
              </button>
            ))}
          
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            إجراءات سريعة
          </h3>
          <div className="flex flex-col gap-2">
            {[
              "تسجيل طالب جديد",
              "إضافة معلم",
              "إنشاء حلقة جديدة",
              "تسجيل دفعة مالية",
              "إضافة إعلان",
            ].map((action) => (
              <button
                key={action}
                type="button"
                className={cn(
                  "w-full rounded-lg px-4 py-2.5 text-sm font-medium text-start transition-colors",
                  "bg-muted hover:bg-accent text-foreground",
                  "focus-ring",
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
