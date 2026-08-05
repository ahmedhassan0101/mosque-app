// components/layout/Sidebar.tsx
"use client"
import { cn } from "@/lib/utils/utils";
import { getVisibleSections } from "@/constants/navigation";
import { NavSectionGroup } from "./sidebar/NavSectionGroup";

/*
  Sidebar — Final Implementation
  ─────────────────────────────────────────────
  التحسينات الأساسية عن النسخة السابقة:

  1. gap-5 ثابت بين الأقسام (flex flex-col gap-5) بدل padding
     متغير حسب الحالة — فصل بصري واضح ومتسق
  2. Logo box: مربع emerald solid بدل dot فقط — anchor بصري أقوى
  3. Footer بمعلومة الإصدار — تفصيلة صغيرة تعطي إحساس الاكتمال
  ─────────────────────────────────────────────
*/

interface SidebarProps {
  role?: string;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({
  role = "SUPERVISOR",
  className,
  onNavigate,
}: SidebarProps) {
  const sections = getVisibleSections(role);

  return (
    <aside
      className={cn(
        "flex h-dvh flex-col border-e border-border bg-sidebar",
        className,
      )}
    >
      {/* ── Header — Logo box + اسم المسجد ──────────────────────── */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary"
          aria-hidden="true"
        >
          <span className="size-2 rounded-full bg-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="truncate text-sm font-medium text-foreground">
            مسجد النور
          </span>
          <span className="text-[11px] text-muted-foreground">
            لوحة الإدارة
          </span>
        </div>
      </div>

      {/* ── Nav — gap-5 ثابت بين الأقسام ─────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <div className="flex flex-col gap-5">
          {sections.map((section) => (
            <NavSectionGroup
              key={section.title}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* ── Footer — معلومة الإصدار ─────────────────────────────── */}
      <div className="shrink-0 border-t border-border px-4 py-2.5">
        <span className="font-mono text-[10.5px] text-muted-foreground/60">
          الإصدار 1.0.0
        </span>
      </div>
    </aside>
  );
}
// // components/layout/Sidebar.tsx

// import { cn } from "@/lib/utils/utils";

// /*
//   Sidebar — Shell Structure Only
//   ─────────────────────────────────────────────
//   هذا الملف يركّز على التقسيم والأحجام فقط.
//   المحتوى الداخلي (logo, nav sections, items) هيتم بناؤه
//   في جلسة لاحقة بعد الاتفاق على شكل كل عنصر.

//   Layout الداخلي:
//     ┌─────────────────────┐
//     │ Header (logo/مسجد)  │ ← ثابت، h محدد
//     ├─────────────────────┤
//     │                     │
//     │ Nav (scrollable)    │ ← flex-1، overflow-y-auto
//     │                     │
//     ├─────────────────────┤
//     │ Footer (اختياري)    │ ← ثابت، لو احتجنا later
//     └─────────────────────┘

//   بيُستخدم في حالتين:
//   1. Desktop: <Sidebar className="hidden lg:flex" /> — fixed width من الـ parent grid
//   2. Mobile: <Sidebar className="flex w-full" /> — جوه SheetContent

//   نفس الـ component، الفرق بس في الـ className من بره.
//   ─────────────────────────────────────────────
// */

// interface SidebarProps {
//   role?: string;
//   className?: string;
//   /** يُستدعى عند الضغط على أي لينك — لإقفال الـ Sheet على الموبايل */
//   onNavigate?: () => void;
// }

// export function Sidebar({ role, className, onNavigate }: SidebarProps) {
//   return (
//     <aside
//       className={cn(
//         "flex h-dvh flex-col border-e border-border bg-sidebar",
//         className,
//       )}
//     >
//       {/* ── Header — مساحة ثابتة لشعار/اسم المسجد ──────────────
//           h-14 = نفس ارتفاع الـ Navbar تقريباً، عشان الخط الفاصل
//           بين الـ header والـ navbar يتراصوا بصرياً
//       */}
//       <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
//         {/* placeholder — هيتحدد شكله في الجلسة القادمة */}
//         <div className="h-6 w-32 rounded bg-muted" />
//       </div>

//       {/* ── Nav — المنطقة القابلة للتمرير ───────────────────────
//           flex-1 + overflow-y-auto: لو محتوى الـ nav أطول من الشاشة
//           (مدير يشوف كل الأقسام) يتمرر هو لوحده، الـ header
//           والـ footer يفضلوا ثابتين
//       */}
//       <nav className="flex-1 overflow-y-auto px-3 py-4">
//         {/* placeholder — NAV_SECTIONS rendering هيتحدد لاحقاً */}
//         <div className="flex flex-col gap-1">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="h-9 rounded-md bg-muted/60" />
//           ))}
//         </div>
//       </nav>

//       {/* ── Footer — مساحة محجوزة، اختياري الاستخدام ───────────
//           مثال مستقبلي: نسخة النظام، رابط الدعم، إلخ
//       */}
//       <div className="shrink-0 border-t border-border p-3" />
//     </aside>
//   );
// }

// // components/dashboard/sidebar.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useCallback } from "react";
// import { ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils/utils";
// import {
//   NAV_SECTIONS,
//   type NavItem,
//   type NavSection,
// } from "@/constants/navigation";

// /* ─────────────────────────────────────────────────────────────
//    Types
// ───────────────────────────────────────────────────────────── */

// interface SidebarProps {
//   role?: string;
//   className?: string;
//   onNavigate?: () => void;
// }

// /* ─────────────────────────────────────────────────────────────
//    NavLeaf — terminal link inside a collapsible group
// ───────────────────────────────────────────────────────────── */

// function NavLeaf({
//   href,
//   label,
//   active,
//   onClick,
// }: {
//   href: string;
//   label: string;
//   active: boolean;
//   onClick?: () => void;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className={cn(
//         // indent from parent icon + left border track
//         "relative flex items-center gap-2.5 py-1.5 pe-3 ps-10 text-sm",
//         "rounded-md transition-colors duration-150 focus-ring",
//         // vertical track line
//         "before:absolute before:end-6.5 before:top-0 before:h-full before:w-px before:bg-sidebar-border",
//         active
//           ? "font-medium text-primary before:bg-primary/60"
//           : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
//       )}
//     >
//       {/* Dot */}
//       <span
//         className={cn(
//           "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
//           active ? "bg-primary" : "bg-muted-foreground/50",
//         )}
//       />
//       {label}
//     </Link>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    NavItemRow — single item (link or collapsible group)
// ───────────────────────────────────────────────────────────── */

// function NavItemRow({
//   item,
//   pathname,
//   onNavigate,
// }: {
//   item: NavItem;
//   pathname: string;
//   onNavigate?: () => void;
// }) {
//   const isLeafActive = pathname === item.href;
//   const isChildActive =
//     item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
//   const isActive = isLeafActive || isChildActive;
//   const hasChildren = Boolean(item.children?.length);

//   // Start open if any child is active
//   const [open, setOpen] = useState(isActive && hasChildren);
//   const toggle = useCallback(() => setOpen((p) => !p), []);

//   const Icon = item.icon;

//   // ── Simple link ────────────────────────────────────────────
//   if (!hasChildren) {
//     return (
//       <Link
//         href={item.href}
//         onClick={onNavigate}
//         className={cn(
//           "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
//           "transition-colors duration-150 focus-ring",
//           isActive
//             ? "sidebar-active-glow text-primary"
//             : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//         )}
//       >
//         <Icon
//           className={cn(
//             "h-4 w-4 shrink-0 transition-colors",
//             isActive
//               ? "text-primary"
//               : "text-muted-foreground group-hover:text-sidebar-foreground",
//           )}
//         />
//         <span className="flex-1 truncate">{item.label}</span>
//         {item.badge != null && (
//           <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
//             {item.badge}
//           </span>
//         )}
//       </Link>
//     );
//   }

//   // ── Collapsible group ──────────────────────────────────────
//   return (
//     <div>
//       <button
//         type="button"
//         onClick={toggle}
//         aria-expanded={open}
//         className={cn(
//           "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
//           "transition-colors duration-150 focus-ring",
//           isActive
//             ? "text-primary"
//             : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//         )}
//       >
//         <Icon
//           className={cn(
//             "h-4 w-4 shrink-0 transition-colors",
//             isActive
//               ? "text-primary"
//               : "text-muted-foreground group-hover:text-sidebar-foreground",
//           )}
//         />
//         <span className="flex-1 truncate text-start">{item.label}</span>
//         <ChevronDown
//           className={cn(
//             "h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200",
//             open && "rotate-180",
//           )}
//         />
//       </button>

//       {/*
//        * CSS grid trick for smooth height animation without JS height calc.
//        * grid-rows-[0fr] → grid-rows-[1fr] creates a collapsible with
//        * proper transition — no layout jank.
//        */}
//       <div
//         className={cn(
//           "grid transition-all duration-200 ease-in-out",
//           open
//             ? "grid-rows-[1fr] opacity-100 mt-0.5"
//             : "grid-rows-[0fr] opacity-0",
//         )}
//       >
//         <div className="overflow-hidden">
//           <div className="flex flex-col gap-px pb-1 pt-0.5">
//             {item.children!.map((child) => (
//               <NavLeaf
//                 key={child.href}
//                 href={child.href}
//                 label={child.label}
//                 active={pathname === child.href}
//                 onClick={onNavigate}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    NavSectionGroup — labeled section
// ───────────────────────────────────────────────────────────── */

// function NavSectionGroup({
//   section,
//   pathname,
//   onNavigate,
// }: {
//   section: NavSection;
//   pathname: string;
//   onNavigate?: () => void;
// }) {
//   return (
//     <div className="flex flex-col gap-px">
//       <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 select-none">
//         {section.title}
//       </p>
//       {section.items.map((item) => (
//         <NavItemRow
//           key={item.href}
//           item={item}
//           pathname={pathname}
//           onNavigate={onNavigate}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    Sidebar — main export

//    Authorization logic:
//    • "الإعدادات" section is shown ONLY to ADMIN role.
//      Add more role gates here as the product grows.
// ───────────────────────────────────────────────────────────── */

// export function Sidebar({
//   role = "USER",
//   className,
//   onNavigate,
// }: SidebarProps) {
//   const pathname = usePathname();

//   // Filter sections by role — only ADMIN sees "الإعدادات"
//   const visibleSections = NAV_SECTIONS.filter((s) => {
//     if (s.title === "الإعدادات") return role === "ADMIN";
//     return true;
//   });

//   return (
//     <aside
//       aria-label="القائمة الجانبية"
//       className={cn(
//         "flex flex-col shrink-0 h-full",
//         "w-64 border-e border-sidebar-border bg-sidebar bg-noise",
//         className,
//       )}
//     >
//       {/* ── Brand / Logo ─────────────────────────────────── */}
//       <div className="flex h-15 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//           <ChevronDown className="h-4 w-4" />
//         </div>
//         <div className="flex flex-col leading-none gap-0.5">
//           <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight">
//             مسجد ERP
//           </span>
//           <span className="text-[10px] text-muted-foreground">
//             لوحة الإدارة
//           </span>
//         </div>
//       </div>

//       {/* ── Navigation ───────────────────────────────────── */}
//       <nav
//         aria-label="التنقل الرئيسي"
//         className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-thin"
//       >
//         <div className="flex flex-col gap-5">
//           {visibleSections.map((section) => (
//             <NavSectionGroup
//               key={section.title}
//               section={section}
//               pathname={pathname}
//               onNavigate={onNavigate}
//             />
//           ))}
//         </div>
//       </nav>

//       {/* ── Footer ───────────────────────────────────────── */}
//       <div className="shrink-0 border-t border-sidebar-border px-5 py-3">
//         <p className="text-[10px] text-muted-foreground/60 tabular-nums">
//           الإصدار 1.0.0 · مسجد ERP
//         </p>
//       </div>
//     </aside>
//   );
// }
