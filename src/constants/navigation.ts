import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Megaphone,
  Banknote,
  Settings,
  type LucideIcon,
} from "lucide-react";

/** Represents a single navigation item in the sidebar */
export interface NavItem {
  /** Arabic display label */
  label: string;
  /** Route path */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Optional badge count */
  badge?: number;
  /** Nested sub-items */
  children?: Omit<NavItem, "icon" | "children">[];
}

/** Represents a grouped section in the sidebar */
export interface NavSection {
  /** Arabic section title */
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "الرئيسية",
    items: [
      {
        label: "لوحة التحكم",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "إدارة الأفراد",
    items: [
      {
        label: "الطلاب",
        href: "/dashboard/students",
        icon: Users,
        children: [
          { label: "قائمة الطلاب", href: "/dashboard/students" },
          { label: "تسجيل طالب جديد", href: "/dashboard/students/new" },
          { label: "الحضور والغياب", href: "/dashboard/students/attendance" },
        ],
      },
      {
        label: "المعلمون",
        href: "/dashboard/teachers",
        icon: GraduationCap,
        children: [
          { label: "قائمة المعلمين", href: "/dashboard/teachers" },
          { label: "إضافة معلم جديد", href: "/dashboard/teachers/new" },
          { label: "جداول الدروس", href: "/dashboard/teachers/schedules" },
        ],
      },
    ],
  },
  {
    title: "إدارة التعليم",
    items: [
      {
        label: "الدروس والحلقات",
        href: "/dashboard/circles",
        icon: BookOpen,
        children: [
          { label: "الحلقات القرآنية", href: "/dashboard/circles/quran" },
          { label: "الدروس العلمية", href: "/dashboard/circles/lessons" },
          { label: "المقررات الدراسية", href: "/dashboard/circles/curricula" },
        ],
      },
      {
        label: "الجدول الدراسي",
        href: "/dashboard/schedule",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "الأنشطة والإعلانات",
    items: [
      {
        label: "الفعاليات",
        href: "/dashboard/events",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "الإدارة المالية",
    items: [
      {
        label: "المالية",
        href: "/dashboard/finance",
        icon: Banknote,
        children: [
          { label: "الرسوم الدراسية", href: "/dashboard/finance/fees" },
          { label: "التبرعات", href: "/dashboard/finance/donations" },
          { label: "التقارير المالية", href: "/dashboard/finance/reports" },
        ],
      },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      {
        label: "الإعدادات",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
