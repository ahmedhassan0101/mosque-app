// src/components/teacher/DeleteTeacherButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { deleteTeacher } from "@/actions/teacher.actions";
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
import { Button } from "@/components/ui/button";

interface DeleteTeacherButtonProps {
  id: string;
  name: string;
  /** If true, navigates to /dashboard/teachers after delete (used on profile page) */
  redirectAfterDelete?: boolean;
}

/**
 * Renders a delete trigger button + confirmation AlertDialog.
 * Uses useTransition to call the deleteTeacher Server Action with
 * a loading state, then shows a toast on success/error.
 */
export function DeleteTeacherButton({
  id,
  name,
  redirectAfterDelete = false,
}: DeleteTeacherButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTeacher(id);

      if (result.status !== "success") {
        toast.error(result.message ?? "حدث خطأ أثناء الحذف.");
        return;
      }

      toast.success(result.message ?? "تم الحذف بنجاح.");
      if (redirectAfterDelete) router.push("/dashboard/teachers");
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={`حذف المعلم ${name}`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <TriangleAlert size={18} className="text-destructive" />
            </div>
            <AlertDialogTitle>تأكيد حذف المعلم</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من حذف{" "}
            <span className="font-semibold text-foreground">{name}</span>؟
            <br />
            لا يمكن التراجع عن هذه العملية.
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