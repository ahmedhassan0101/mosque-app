"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";

interface HeaderProps {
  user: { name?: string | null; email?: string | null; role?: string };
}

const roleLabels: Record<string, string> = {
  admin: "مسؤول",
  sheikh: "شيخ",
  supervisor: "مشرف",
};
// 
export function Header({ user }: HeaderProps) {
  const initials = user.name?.slice(0, 2) ?? "م";

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {roleLabels[user.role ?? "supervisor"]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2"
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <User size={14} /> الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={14} /> تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
