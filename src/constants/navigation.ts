// constants/navigation.ts

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

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional numeric badge (e.g. pending count) */
  badge?: number;
  /** Sub-routes rendered as indented leaf links */
  children?: NavChild[];
  /**
   * Roles that can see this item.
   * Omit (undefined) = visible to all roles.
   * The Sidebar component enforces this at section level too.
   */
  roles?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
  /**
   * If set, the entire section is restricted to these roles.
   * The Sidebar filters sections before rendering.
   */
  roles?: string[];
}

/* ─────────────────────────────────────────────────────────────
   Navigation Tree
   
   Architectural note:
   Sections are the primary grouping unit. Role filtering happens
   once at the section level in Sidebar, keeping nav data clean
   and the component dumb about auth logic.
───────────────────────────────────────────────────────────── */

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
        label: "المجموعات والحلقات",
        href: "/dashboard/groups",
        icon: BookOpen,
        children: [
          { label: "حلقات القرآن", href: "/dashboard/groups/quran" },
          { label: "جلسات التربية", href: "/dashboard/groups/tarbiya" },
          { label: "دروس التجويد", href: "/dashboard/groups/tajweed" },
          { label: "المقرأة", href: "/dashboard/groups/maqraa" },
          { label: "الملعب", href: "/dashboard/groups/playground" },
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
    title: "الأنشطة",
    items: [
      {
        label: "الفعاليات",
        href: "/dashboard/events",
        icon: Megaphone,
      },
    ],
  },

  {
    title: "المالية",
    roles: ["ADMIN"],
    items: [
      {
        label: "الإدارة المالية",
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
    // Entire section gated to ADMIN — Sidebar filters this
    title: "الإعدادات",
    roles: ["ADMIN"],
    items: [
      {
        label: "إعدادات النظام",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
