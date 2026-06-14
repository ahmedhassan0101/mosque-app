// components/dashboard/navbar.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Menu, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar";
import { logoutUser } from "@/actions/auth.actions";

/* ─────────────────────────────────────────────────────────────
   ThemeToggle
───────────────────────────────────────────────────────────── */

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Avoid SSR mismatch — render neutral icon until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled
        aria-label="تغيير المظهر"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="تغيير المظهر"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-32">
        {(
          [
            { value: "light", Icon: Sun, label: "فاتح" },
            { value: "dark", Icon: Moon, label: "داكن" },
            { value: "system", Icon: Monitor, label: "النظام" },
          ] as const
        ).map(({ value, Icon: ItemIcon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="gap-2 cursor-pointer"
            aria-current={theme === value ? "true" : undefined}
          >
            <ItemIcon className="h-3.5 w-3.5" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
   UserDropdown
───────────────────────────────────────────────────────────── */

function UserDropdown({ session }: { session: Session | null }) {
  if (!session?.user) return null;

  const { name, email, image } = session.user;
  // Graceful initials — first two chars of name, or "؟؟"
  const initials = name ? name.trim().slice(0, 2) : "؟؟";

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button
          aria-label="قائمة المستخدم"
          className="rounded-full focus-ring outline-none ring-offset-background"
        >
          <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary/40 transition-shadow">
            <AvatarImage src={image ?? ""} alt={name ?? "المستخدم"} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Identity */}
        <DropdownMenuLabel className="font-normal py-2">
          <p className="text-sm font-semibold text-foreground leading-none mb-1">
            {name}
          </p>
          <p className="text-xs text-muted-foreground leading-none truncate">
            {email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-3.5 w-3.5" />
            الملف الشخصي
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            الإعدادات
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logoutUser()}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
   MobileSidebarTrigger
───────────────────────────────────────────────────────────── */

function MobileSidebarTrigger({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden text-muted-foreground hover:text-foreground"
          aria-label="فتح القائمة"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      {/* RTL → sheet from the right */}
      <SheetContent
        side="right"
        className="w-64 p-0 border-e border-sidebar-border"
        aria-label="القائمة الجانبية"
      >
        <SheetTitle className="sr-only">القائمة الجانبية</SheetTitle>
        <Sidebar
          role={role}
          className="flex w-full"
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────────────────────
   Navbar — main export
   
   Design notes:
   • Height locked at 3.75rem to align pixel-perfect with sidebar brand area.
   • Backdrop blur only activates via the class — no JS scroll listener needed.
   • Session is passed down from the Server Component layout, so no client
     fetch is required here (avoids a loading flash).
───────────────────────────────────────────────────────────── */

export function Navbar({ session }: { session: Session | null }) {
  const role = (session?.user as { role?: string })?.role;

  return (
    <header
      className="
        shrink-0 sticky top-0 z-40
        flex h-15 items-center gap-3
        border-b border-border
        bg-background/80 backdrop-blur-sm
        px-4 md:px-6
      "
    >
      {/* Mobile trigger (only visible < md) */}
      <MobileSidebarTrigger role={role} />

      {/* Spacer — pushes actions to the end (RTL: left side) */}
      <div className="flex-1" />

      {/* Actions cluster */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* Thin separator */}
        <div className="mx-1.5 h-4 w-px bg-border" aria-hidden />

        <UserDropdown session={session} />
      </div>
    </header>
  );
}
