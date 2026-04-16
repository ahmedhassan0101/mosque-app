"use client";

import Link from "next/link";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_SECTIONS,
  type NavItem,
  type NavSection,
} from "@/constants/navigation";

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

interface NavLeafProps {
  href: string;
  label: string;
  isActive: boolean;
}

/**
 * Renders a terminal (leaf) navigation link with active state styling.
 */
function NavLeaf({ href, label, isActive }: NavLeafProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-150",
        "nav-item-hover focus-ring",
        "me-0 ms-7 border-e border-sidebar-border ps-3",
        isActive
          ? "text-sidebar-primary font-medium border-e-2 border-e-primary"
          : "text-muted-foreground hover:text-sidebar-foreground",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 shrink-0" />
      {label}
    </Link>
  );
}

interface NavItemRowProps {
  item: NavItem;
  pathname: string;
}

/**
 * Renders a single nav item which may be a simple link or a collapsible group.
 */
function NavItemRow({ item, pathname }: NavItemRowProps) {
  const isExactActive = pathname === item.href;
  const isChildActive =
    item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  const isActive = isExactActive || isChildActive;
  const hasChildren = Boolean(item.children?.length);

  const [open, setOpen] = useState<boolean>(isActive);

  const toggle = useCallback(() => {
    if (hasChildren) setOpen((prev) => !prev);
  }, [hasChildren]);

  const Icon = item.icon;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          "nav-item-hover focus-ring",
          isActive
            ? "sidebar-active-glow text-sidebar-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-sidebar-foreground",
          )}
        />
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge !== undefined && (
          <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          "nav-item-hover focus-ring",
          isActive
            ? "text-sidebar-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-sidebar-foreground",
          )}
        />
        <span className="flex-1 truncate text-start">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Collapsible children */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-1">
            {item.children!.map((child) => (
              <NavLeaf
                key={child.href}
                href={child.href}
                label={child.label}
                isActive={pathname === child.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavSectionGroupProps {
  section: NavSection;
  pathname: string;
}

/**
 * Renders a labeled section group of navigation items.
 */
function NavSectionGroup({ section, pathname }: NavSectionGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {section.title}
      </p>
      {section.items.map((item) => (
        <NavItemRow key={item.href} item={item} pathname={pathname} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Sidebar Export
───────────────────────────────────────────── */

/**
 * Sidebar component for the Masjid ERP dashboard.
 *
 * - RTL-aware layout (right-anchored on RTL pages)
 * - Collapsible navigation groups
 * - Active state tracking via pathname
 * - Sticky positioning with overflow scroll
 */
export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="القائمة الجانبية"
      className={cn(
        "flex flex-col shrink-0",
        "h-full bg-sidebar border-e border-sidebar-border bg-noise",
        // "sticky top-0 overflow-hidden bg-noise",
        isMobile ? "w-full" : "w-64",
      )}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 h-20">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          Mosque
          {/* <Mosque className="h-5 w-5" /> */}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-sidebar-foreground">
            نظام إدارة المسجد
          </span>
          <span className="text-[10px] text-muted-foreground">
            لوحة الإدارة
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-5">
          {NAV_SECTIONS.map((section) => (
            <NavSectionGroup
              key={section.title}
              section={section}
              pathname={pathname}
            />
          ))}
        </div>
      </nav>

      {/* ── Footer / Version ── */}
      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[10px] text-muted-foreground">
          الإصدار 1.0.0 · نظام إدارة المسجد
        </p>
      </div>
    </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";

// import {
//   LayoutDashboard,
//   Users,
//   BookOpen,
//   Star,
//   BarChart2,
//   CalendarDays,
//   MessageSquare,
//   Settings,
//   // ChevronLeft,
// } from "lucide-react";

// const navItems = [
//   { href: "/", label: "الرئيسية", icon: LayoutDashboard },
//   { href: "/students", label: "الطلاب", icon: Users },
//   { href: "/sessions", label: "تسجيل الحلقات", icon: CalendarDays },
//   { href: "/activities", label: "الأنشطة", icon: BookOpen },
//   { href: "/statistics", label: "الإحصائيات", icon: BarChart2 },
//   { href: "/meetings", label: "الاجتماعات", icon: MessageSquare },
//   { href: "/sheikhs", label: "المشايخ", icon: Star },
//   { href: "/groups", label: "المجموعات", icon: Star },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="flex flex-col w-64 h-screen bg-primary text-white fixed right-0 top-0 z-30">
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-500">
//         <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-primary-900 font-bold text-sm">
//           م
//         </div>
//         <span className="font-bold text-lg">إدارة المسجد</span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         {navItems.map(({ href, label, icon: Icon }) => {
//           const isActive =
//             pathname === href || (href !== "/" && pathname.startsWith(href));
//           return (
//             <Link
//               key={href}
//               href={href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-primary-700 text-white"
//                   : "text-primary-100 hover:bg-primary-700/50 hover:text-white",
//               )}
//             >
//               <Icon size={18} />
//               <span>{label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Settings */}
//       <div className="px-3 py-4 border-t border-primary-500">
//         <Link
//           href="/settings"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-100 hover:bg-primary-700/50"
//         >
//           <Settings size={18} />
//           <span>الإعدادات</span>
//         </Link>
//       </div>
//     </aside>
//   );
// }

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
