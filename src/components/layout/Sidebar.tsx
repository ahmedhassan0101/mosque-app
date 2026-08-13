// components/layout/Sidebar.tsx
"use client"
import { cn } from "@/lib/utils/utils";
import { getVisibleSections } from "@/constants/navigation";
import { NavSectionGroup } from "./sidebar/NavSectionGroup";


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
        "flex h-dvh flex-col border-e border-border bg-sidebar direction-rtl",
        className,
      )}
    >
      {/* ── Header — Logo box ───────────────────────── */}
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

      {/* ── Nav ─────────────────────────── */}
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

      {/* ── Footer ─────────────────────────────── */}
      <div className="shrink-0 border-t border-border px-4 py-2.5">
        <span className="font-mono text-[10.5px] text-muted-foreground/60">
          الإصدار 1.0.0
        </span>
      </div>
    </aside>
  );
}
