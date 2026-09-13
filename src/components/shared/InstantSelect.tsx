"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Matches the project's unified server-action response shape.
 * Replace with the real shared type (e.g. `@/types/action`) if one exists.
 */
interface ActionResponse<T = unknown> {
  status: "success" | "error" | "fail";
  message?: string;
  data?: T;
}

interface InstantSelectOption {
  label: string;
  value: string;
}

interface InstantSelectProps {
  /** Current saved value — the select is controlled off this, not defaultValue */
  value: string;
  options: InstantSelectOption[];
  /** Server action to run on change. Must resolve to the shared ActionResponse shape. */
  onChangeAction: (value: string) => Promise<ActionResponse>;
  /** Called after a successful mutation — sync your local list/state here */
  onSuccess?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  align?: "start" | "center" | "end";
}

/**
 * A <Select> that mutates immediately on change — no form, no submit button.
 * Use for inline table/list edits (e.g. changing a user's role from a row,
 * reassigning a group's teacher from its detail page).
 *
 * Handles the boilerplate that used to get rewritten at every call site:
 * pending/disabled state, success/error toasts, and — importantly —
 * reverting the visible value if the mutation fails. A plain Select with
 * `defaultValue` (uncontrolled) can't do that last part: it keeps showing
 * whatever the user picked even after the server rejects it.
 *
 * Don't use this inside a react-hook-form <form> — that's FormSelect's job.
 * This is specifically for edits that save themselves immediately.
 */
export function InstantSelect({
  value,
  options,
  onChangeAction,
  onSuccess,
  disabled,
  size = "sm",
  className,
  align = "end",
}: InstantSelectProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string) => {
    const previous = displayValue;
    setDisplayValue(next); // optimistic

    startTransition(async () => {
      const result = await onChangeAction(next);

      if (result.status !== "success") {
        setDisplayValue(previous); // revert — the whole point of being controlled
        toast.error(result.message ?? "حدث خطأ غير متوقع.");
        return;
      }

      toast.success(result.message);
      onSuccess?.(next);
    });
  };

  return (
    <Select
      value={displayValue}
      onValueChange={handleChange}
      disabled={disabled || isPending}
    >
      <SelectTrigger size={size} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align={align}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// -------------------------------

// "use client";

// import { useState, useTransition } from "react";
// import { removeUserFromMosque, updateUserRole } from "@/actions/settings.actions";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { InstantSelect } from "@/components/shared/InstantSelect";
// import { toast } from "sonner";
// import type { RolesType } from "@/constants";

// interface UserItem {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   image: string | null;
// }

// interface UserManagementProps {
//   users: UserItem[];
//   mosqueId: string;
//   currentUserId: string;
// }

// // Role label map — single source of truth for display strings
// const ROLE_LABELS: Record<string, string> = {
//   ADMIN: "مدير",
//   SUPERVISOR: "مشرف",
// };

// const ROLE_OPTIONS = [
//   { label: "مدير", value: "ADMIN" },
//   { label: "مشرف", value: "SUPERVISOR" },
// ];

// export function UserManagement({
//   users,
//   mosqueId,
//   currentUserId,
// }: UserManagementProps) {
//   const [localUsers, setLocalUsers] = useState(users);
//   // Only for the remove action now — role changes have their own
//   // independent pending state inside InstantSelect per row.
//   const [isRemoving, startRemoving] = useTransition();

//   const handleRemove = (userId: string) => {
//     startRemoving(async () => {
//       const result = await removeUserFromMosque(mosqueId, userId);

//       if (result.status !== "success") {
//         toast.error(result.message);
//         return;
//       }

//       toast.success(result.message);
//       setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
//     });
//   };

//   return (
//     <Card className="max-w-2xl">
//       <CardHeader>
//         <CardTitle>المستخدمون</CardTitle>
//         <CardDescription>
//           {localUsers.length} {localUsers.length === 1 ? "مستخدم" : "مستخدمون"}{" "}
//           مسجّلون في هذا المسجد.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="p-0">
//         <ul className="divide-y divide-border">
//           {localUsers.map((user) => {
//             const isSelf = user.id === currentUserId;
//             const initials = user.name
//               .split(" ")
//               .slice(0, 2)
//               .map((w) => w[0])
//               .join("");

//             return (
//               <li
//                 key={user.id}
//                 className="flex items-center justify-between gap-4 px-5 py-3.5"
//               >
//                 <div className="flex min-w-0 items-center gap-3">
//                   <Avatar className="h-8 w-8 shrink-0">
//                     <AvatarImage src={user.image ?? ""} alt={user.name} />
//                     <AvatarFallback className="text-xs font-semibold">
//                       {initials}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2">
//                       <p className="truncate text-sm font-medium text-foreground">
//                         {user.name}
//                       </p>
//                       {isSelf && (
//                         <span className="badge-base rounded-full bg-primary/10 text-primary">
//                           أنت
//                         </span>
//                       )}
//                     </div>
//                     <p
//                       className="truncate text-xs text-muted-foreground"
//                       dir="ltr"
//                     >
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>

//                 {isSelf ? (
//                   // Current user — read-only badge, no controls.
//                   // Prevents self-demotion accidents.
//                   <span className="badge-base badge-neutral border border-border">
//                     {ROLE_LABELS[user.role] ?? user.role}
//                   </span>
//                 ) : (
//                   <div className="flex shrink-0 items-center gap-2">
//                     <InstantSelect
//                       value={user.role}
//                       options={ROLE_OPTIONS}
//                       onChangeAction={(newRole) =>
//                         updateUserRole(mosqueId, user.id, newRole as RolesType)
//                       }
//                       onSuccess={(newRole) =>
//                         setLocalUsers((prev) =>
//                           prev.map((u) =>
//                             u.id === user.id ? { ...u, role: newRole } : u
//                           )
//                         )
//                       }
//                       className="w-28"
//                     />

//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       disabled={isRemoving}
//                       onClick={() => handleRemove(user.id)}
//                     >
//                       إزالة
//                     </Button>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </CardContent>
//     </Card>
//   );
// }