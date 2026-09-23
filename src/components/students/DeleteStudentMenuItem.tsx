// src/components/students/DeleteStudentMenuItem.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { deleteStudent } from "@/actions/student.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// افترضتها بالـ API الحديث اللي فيه variant="destructive" على DropdownMenuItem —
// لو النسخة المركّبة عندك أقدم ومفيهاش الـ prop ده، استبدلها بـ
// className="text-destructive focus:text-destructive focus:bg-destructive/10"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteStudentMenuItemProps {
  id: string;
  name: string;
  /** Called with true when deletion starts, false if it fails */
  onPendingChange?: (pending: boolean) => void;
}

/**
 * The "حذف" entry inside StudentRow's kebab menu.
 *
 * The AlertDialog is rendered as a sibling of the menu item, not nested
 * inside it as a Trigger — its open state is controlled locally instead.
 * Nesting AlertDialogTrigger inside DropdownMenuItem causes a focus
 * hand-off conflict between the two Radix primitives when the menu
 * closes at the same moment the dialog tries to open.
 */
export function DeleteStudentMenuItem({
  id,
  name,
  onPendingChange,
}: DeleteStudentMenuItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      onPendingChange?.(true);

      const result = await deleteStudent(id);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ أثناء الحذف.");
        onPendingChange?.(false);
        return;
      }

      toast.success(result.message ?? "تم الحذف بنجاح.");
      // No need to call onPendingChange(false) on success — the row
      // unmounts once revalidatePath refreshes the list.
    });
  };

  return (
    <>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => {
          // Prevent the menu's own close handling from racing the dialog
          e.preventDefault();
          setConfirmOpen(true);
        }}
      >
        <Trash2 size={14} className="me-2" />
        حذف
      </DropdownMenuItem>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <div className="mb-1 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert size={18} className="text-destructive" />
              </div>
              <AlertDialogTitle>تأكيد حذف الطالب</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-start">
              هل أنت متأكد من حذف{" "}
              <span className="font-semibold text-foreground">{name}</span>؟
              <br />
              سيتم إزالته من جميع المجموعات. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="me-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، احذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
