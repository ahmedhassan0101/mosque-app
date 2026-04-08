"use client";

import { useState, useTransition } from "react";
import { Trash2, Trash2Icon } from "lucide-react";
import { toast } from "sonner"; // مهم جداً التوست يكون هنا عشان الريوزابيلتي

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// 1. تعريف التايب الصحيح لنتيجة السيرفر أكشن لحل مشكلة الـ await ts(80007)
type ActionResponse = { error?: string; success?: boolean } | void;

interface DeleteButtonProps {
  name: string;
  id: string;
  handleDelete: (id: string) => Promise<ActionResponse>;
  deletedItem: "student" | "sheikh" | "group";
}

// استخراج الأوبجيكت بره الكمبوننت عشان ميتعملوش Re-create مع كل ريندر (Performance)
const ITEM_LABELS = {
  student: "الطالب",
  sheikh: "الشيخ",
  group: "المجموعة",
};

export function DeleteButton({
  name,
  id,
  handleDelete,
  deletedItem,
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const label = ITEM_LABELS[deletedItem];

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await handleDelete(id);
      
      if (result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(`تم حذف ${label} بنجاح`);
        setIsOpen(false); 
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 size={14} className="ml-1" />
          حذف
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>حذف {label}</AlertDialogTitle>

          <AlertDialogDescription className="text-base leading-relaxed">
            هل تريد بالتأكيد حذف {label} <strong className="text-foreground">{name}</strong>؟
            <br /> 
            <span className="text-sm text-muted-foreground mt-2 inline-block">
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            إلغاء
          </AlertDialogCancel>
          
          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}