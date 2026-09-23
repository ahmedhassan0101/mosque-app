// src/components/shared/ListPageHeader.tsx
import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  /**
   * Extra buttons specific to this page (import, export, ...).
   * Rendered before the primary button so it lands on its expected
   * side (primary stays left-most in the RTL row) — omit entirely
   * for pages that don't need anything beyond "add new".
   */
  children?: React.ReactNode;
}

export function ListPageHeader({
  title,
  description,
  primaryAction,
  children,
}: ListPageHeaderProps) {
  const PrimaryIcon = primaryAction.icon ?? Plus;

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-page-title">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}
        <Button asChild>
          <Link href={primaryAction.href}>
            <PrimaryIcon size={16} className="me-2" />
            {primaryAction.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
