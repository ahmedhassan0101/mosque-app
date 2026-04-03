"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Star,
  BarChart2,
  CalendarDays,
  MessageSquare,
  Settings,
  // ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/students", label: "الطلاب", icon: Users },
  { href: "/sessions", label: "تسجيل الحلقات", icon: CalendarDays },
  { href: "/activities", label: "الأنشطة", icon: BookOpen },
  { href: "/statistics", label: "الإحصائيات", icon: BarChart2 },
  { href: "/meetings", label: "الاجتماعات", icon: MessageSquare },
  { href: "/sheikhs", label: "المشايخ", icon: Star },
    { href: "/groups", label: "المجموعات", icon: Star },

];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 h-screen bg-primary text-white fixed right-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-500">
        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-primary-900 font-bold text-sm">
          م
        </div>
        <span className="font-bold text-lg">إدارة المسجد</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-700 text-white"
                  : "text-primary-100 hover:bg-primary-700/50 hover:text-white",
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-primary-500">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-100 hover:bg-primary-700/50"
        >
          <Settings size={18} />
          <span>الإعدادات</span>
        </Link>
      </div>
    </aside>
  );
}


// في navItems — أضف الشرط ده
// بعد ما تجيب الـ session في الـ Sidebar

// حوّل الـ Sidebar لـ async server component
// import { auth } from "@/lib/auth/options";

// export async function Sidebar() {
//   const session = await auth();
//   const isSuperAdmin = session?.user.role === "superadmin";

//   // أضف للـ navItems:
//   // لو isSuperAdmin:
//   { href: "/admin/mosques", label: "المساجد", icon: Building2 }
//   // ...
// }