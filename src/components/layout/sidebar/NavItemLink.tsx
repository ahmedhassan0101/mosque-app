// components/layout/sidebar/NavItemLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import type { NavItem } from "@/constants/navigation";

interface NavItemLinkProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function NavItemLink({ item, onNavigate }: NavItemLinkProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href ?? "");

  return (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={cn(
        "group flex h-9 items-center gap-2.5 rounded-md px-2.5",
        "text-sm transition-colors duration-150",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        size={17}
        className={cn(
          "shrink-0 transition-colors duration-150",
          !isActive && "text-muted-foreground group-hover:text-foreground",
        )}
        aria-hidden="true"
      />
      <span className="truncate">{item.label}</span>

      {item.badge !== undefined && (
        <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
