// components/layout/sidebar/NavItemCollapsible.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { NavItem } from "@/constants/navigation";

interface NavItemCollapsibleProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function NavItemCollapsible({
  item,
  onNavigate,
}: NavItemCollapsibleProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const children = item.children ?? [];

  // جمع روابط الأبناء للتحقق من الرابط الأكثر تخصيصاً
  const siblingHrefs = children.map((c) => c.href);

  /**
   * دالة فحص الرابط النشط بدقة:
   * تمنع التداخل بين /dashboard/students و /dashboard/students/new
   */
  const isChildActive = (href: string) => {
    // 1. التطابق التام
    if (pathname === href) return true;

    // 2. إذا كان المسار يمر برابط فرعي، نتحقق أولاً أنه لا يوجد رابط شقيق أطول وأكثر تخصيصاً يطابق المسار الحالي
    if (pathname.startsWith(href + "/")) {
      const hasMoreSpecificSibling = siblingHrefs.some(
        (sibling) =>
          sibling !== href &&
          sibling.length > href.length &&
          (pathname === sibling || pathname.startsWith(sibling + "/")),
      );
      return !hasMoreSpecificSibling;
    }

    return false;
  };

  const hasActiveChild = children.some((child) => isChildActive(child.href));

  const [isOpen, setIsOpen] = useState(hasActiveChild);

  return (
    <div className="flex flex-col">
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          "flex h-9 w-full items-center gap-2.5 rounded-md px-2.5",
          "text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          hasActiveChild
            ? "font-medium text-foreground"
            : "text-foreground/80 hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon
          size={17}
          className="shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-start">{item.label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {/* ── Sub-menu Items ────────────────────────────────────── */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 py-1">
            {children.map((child) => {
              const active = isChildActive(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex h-8 items-center rounded-md ps-9 pe-2.5",
                    "text-sm transition-colors duration-150",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {/* Active dot */}
                  {active && (
                    <span
                      className="absolute inset-s-3.5 size-1.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
