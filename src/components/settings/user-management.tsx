"use client";

import { removeUserFromMosque, updateUserRole } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { UserRole } from "@/types";

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

export function UserManagement({
  users,
  mosqueId,
  currentUserId,
}: UserManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [localUsers, setLocalUsers] = useState(users);


  const handleRoleChange = (userId: string, newRole: UserRole) => {
    startTransition(async () => {
      const result = await updateUserRole(mosqueId, userId, newRole);
      
      if (result.status !== "success") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setLocalUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
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
      setLocalUsers(prev => prev.filter(u => u.id !== userId));
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المستخدمون ({localUsers.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {localUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {user.id !== currentUserId && (
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={user.role}
                  onValueChange={(v) =>
                    handleRoleChange(user.id, v as UserRole)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">مدير</SelectItem>
                    <SelectItem value="SUPERVISOR">مشرف</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(user.id)}
                  disabled={isPending}
                >
                  إزالة
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
