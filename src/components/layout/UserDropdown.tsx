// components/layout/UserDropdown.tsx
"use client"
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import type { Session } from "next-auth";

import { logoutUser } from "@/actions/auth.actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



interface UserDropdownProps {
  session: Session | null;
}

export function UserDropdown({ session }: UserDropdownProps) {
  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name ? name.trim().slice(0, 2) : "؟؟";

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="قائمة المستخدم"
          className="rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Avatar className="ring-2 ring-background">
            <AvatarImage src={image ?? ""} alt={name ?? "المستخدم"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Identity */}
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2 font-normal">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="truncate text-xs text-muted-foreground" dir="ltr">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <User />
            الملف الشخصي
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings />
            الإعدادات
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={() => logoutUser()}>
          <LogOut />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
