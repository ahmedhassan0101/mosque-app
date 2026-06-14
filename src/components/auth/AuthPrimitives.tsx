// components/auth/auth-primitives.tsx
//
// Shared primitives used by every auth page.
//
// AuthHeader   — page title + subtitle slot
// AuthCard     — the thin-bordered content box that holds the form
// AuthFooter   — the "already have an account?" bottom link row
// AuthAlert    — inline success/error notice strip (replaces hardcoded green divs)
//
// Keep this file free of any form state — purely presentational.

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────
   AuthHeader
───────────────────────────────────────────────────────────── */

interface AuthHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function AuthHeader({ title, description, className }: AuthHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-1", className)}>
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AuthCard
   A clean panel with a subtle border. Intentionally no shadow —
   the layout background provides enough visual separation.
───────────────────────────────────────────────────────────── */

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 text-card-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AuthAlert
   Replaces the repeated green/red banner divs scattered across pages.
   type: "success" | "error" | "info"
───────────────────────────────────────────────────────────── */

type AlertType = "success" | "error" | "info";

const alertConfig: Record<
  AlertType,
  { icon: typeof CheckCircle2; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes:
      "border-success/25 bg-success/8 text-success dark:bg-success/12 dark:border-success/20",
  },
  error: {
    icon: AlertCircle,
    classes:
      "border-destructive/25 bg-destructive/8 text-destructive dark:bg-destructive/12 dark:border-destructive/20",
  },
  info: {
    icon: Info,
    classes:
      "border-primary/20 bg-primary/8 text-primary dark:bg-primary/10 dark:border-primary/15",
  },
};

interface AuthAlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

export function AuthAlert({ type, message, className }: AuthAlertProps) {
  const { icon: Icon, classes } = alertConfig[type];
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        classes,
        className,
      )}
    >
      <Icon className="mt-px h-4 w-4 shrink-0" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AuthFooter — bottom link strip
───────────────────────────────────────────────────────────── */

interface AuthFooterProps {
  children: ReactNode;
  className?: string;
}

export function AuthFooter({ children, className }: AuthFooterProps) {
  return (
    <p
      className={cn(
        "mt-5 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
