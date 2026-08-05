// components/layout/sidebar/NavItemCollapsible.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { NavItem } from "@/constants/navigation";

/*
  NavItemCollapsible
  ─────────────────────────────────────────────
  حركة الفتح/القفل: CSS grid trick
  (grid-rows-[0fr] → grid-rows-[1fr] + overflow-hidden على الـ wrapper)
  ده الحل الصحيح لتحريك ارتفاع محتوى متغير بسلاسة، بدون
  الحاجة لقياس الـ height بـ JS أو استخدام max-height تقديري.

  quickAddHref: لو موجودة، بيظهر زرار "+" صغير بجانب الـ chevron.
  الضغط عليه بيروح مباشرة للرابط بدون فتح القائمة الفرعية —
  مفيد لما يكون المستخدم محتاج action سريع متكرر (مثال: تسجيل
  طالب جديد) بدون الحاجة يفتح/يقفل كل مرة.

  Active child indicator: dot صغير emerald بجانب النص، بدل
  أي خط رأسي أو border-right تقليدي.
  ─────────────────────────────────────────────
*/

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

  const hasActiveChild = children.some((child) =>
    pathname.startsWith(child.href),
  );

  const [isOpen, setIsOpen] = useState(hasActiveChild);

  return (
    <div className="flex flex-col">
      {/* ── Row: trigger + quick-add (اختياري) ──────────────────── */}
      <div className="group flex h-9 items-center gap-1 rounded-md px-1">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={cn(
            "flex h-full flex-1 items-center gap-2.5 rounded-md px-1.5",
            "text-sm transition-colors duration-150",
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
        </button>

       

        {/* Chevron — يفتح/يقفل، منفصل عن الـ quick-add */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
        >
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ── Children — CSS grid trick للحركة السموزة ────────────
          grid-rows-[0fr] → [1fr] بيحرك الارتفاع الفعلي للمحتوى
          بدلاً من display:none/block اللحظي
      */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 py-1">
            {children.map((child) => {
              const isChildActive = pathname.startsWith(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex h-8 items-center rounded-md ps-9 pe-2.5",
                    "text-sm transition-colors duration-150",
                    isChildActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {/* Active dot — لمسة جمالية بدل خط رأسي تقليدي */}
                  {isChildActive && (
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
