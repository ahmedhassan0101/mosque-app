// src/components/students/DeleteStudentButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/temp/button";

interface DeleteStudentButtonProps {
  id: string;
  name: string;
  /** Redirect to list after delete — used on profile page */
  redirectAfterDelete?: boolean;
  /** Render as icon-only (for table rows) or as text button (for profile page) */
  variant?: "icon" | "text";
}

export function DeleteStudentButton({
  id,
  name,
  redirectAfterDelete = false,
  variant = "icon",
}: DeleteStudentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStudent(id);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ أثناء الحذف.");
        return;
      }

      toast.success(result.message ?? "تم الحذف بنجاح.");
      if (redirectAfterDelete) router.push("/dashboard/students");
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`حذف الطالب ${name}`}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            aria-label={`حذف الطالب ${name}`}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin ml-2" />
            ) : (
              <Trash2 size={14} className="ml-2" />
            )}
            حذف الطالب
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <TriangleAlert size={18} className="text-destructive" />
            </div>
            <AlertDialogTitle>تأكيد حذف الطالب</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من حذف{" "}
            <span className="font-semibold text-foreground">{name}</span>؟
            <br />
            سيتم إزالة الطالب من جميع المجموعات المسجّل بها. لا يمكن التراجع.
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
                <Loader2 size={14} className="animate-spin ml-2" />
                جاري الحذف...
              </>
            ) : (
              "نعم، احذف"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
