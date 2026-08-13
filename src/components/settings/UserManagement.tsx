"use client";

import {
  removeUserFromMosque,
  updateUserRole,
} from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import type { RolesType } from "@/constants";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

interface UserManagementProps {
  users: UserItem[];
  mosqueId: string;
  currentUserId: string;
}

// Role label map — single source of truth for display strings
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدير",
  SUPERVISOR: "مشرف",
};

export function UserManagement({
  users,
  mosqueId,
  currentUserId,
}: UserManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [localUsers, setLocalUsers] = useState(users);

  const handleRoleChange = (userId: string, newRole: RolesType) => {
    startTransition(async () => {
      const result = await updateUserRole(mosqueId, userId, newRole);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    });
  };

  const handleRemove = (userId: string) => {
    startTransition(async () => {
      const result = await removeUserFromMosque(mosqueId, userId);

      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>المستخدمون</CardTitle>
        <CardDescription>
          {localUsers.length} {localUsers.length === 1 ? "مستخدم" : "مستخدمون"}{" "}
          مسجّلون في هذا المسجد.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/*
         * List instead of space-y-3 with borders — cleaner table-like pattern.
         * divide-y creates separators without extra wrapper divs.
         */}
        <ul className="divide-y divide-border">
          {localUsers.map((user) => {
            const isSelf = user.id === currentUserId;
            // Generate initials: first char of each word, max 2
            const initials = user.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("");

            return (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                {/* Left: avatar + identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.image ?? ""} alt={user.name} />
                    <AvatarFallback className="text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      {isSelf && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          أنت
                        </span>
                      )}
                    </div>
                    <p
                      className="truncate text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Right: role selector + remove button (hidden for self) */}
                {isSelf ? (
                  /*
                   * Current user — show role as read-only badge, no controls.
                   * Prevents self-demotion accidents.
                   */
                  <span className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(v) =>
                        handleRoleChange(user.id, v as RolesType)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="ADMIN">مدير</SelectItem>
                        <SelectItem value="SUPERVISOR">مشرف</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemove(user.id)}
                    >
                      إزالة
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
