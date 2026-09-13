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
import { startTransition, useState, useTransition } from "react";
import type { RolesType } from "@/constants";
import { Users, Trash2 } from "lucide-react";

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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            المستخدمون
          </CardTitle>
          <CardDescription className="text-sm">
            {localUsers.length}{" "}
            {localUsers.length === 1 ? "مستخدم" : "مستخدمون"} مسجّلون في هذا
            المسجد.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y divide-border border-t">
          {localUsers.map((user) => {
            const isSelf = user.id === currentUserId;
            const initials = user.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("");

            return (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Left: avatar + identity */}
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0 border">
                    <AvatarImage src={user.image ?? ""} alt={user.name} />
                    <AvatarFallback className="text-sm font-semibold bg-primary/5 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      {isSelf && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          أنت
                        </span>
                      )}
                    </div>
                    <p
                      className="truncate text-sm text-muted-foreground mt-0.5"
                      dir="ltr"
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Right: Controls */}
                {isSelf ? (
                  <span className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                ) : (
                  <div className="flex shrink-0 items-center gap-3">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(v) =>
                        handleRoleChange(user.id, v as RolesType)
                      }
                      disabled={isPending}
                      dir="rtl"
                    >
                      <SelectTrigger size="sm" className="w-27.5 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="ADMIN">مدير</SelectItem>
                        <SelectItem value="SUPERVISOR">مشرف</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={isPending}
                      onClick={() => handleRemove(user.id)}
                      title="إزالة المستخدم"
                    >
                      <Trash2 className="h-4 w-4" />
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
