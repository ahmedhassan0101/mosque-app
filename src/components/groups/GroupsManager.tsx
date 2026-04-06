/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ACT_LABELS = {
  quran: "قرآن",
  tarbiya: "تربية",
  tajweed: "تجويد",
  maqraa: "مقرأة",
  playground: "ملعب",
};

const groupSchema = z.object({
  name: z.string().min(2, "اسم المجموعة مطلوب"),
  activity: z.enum(["quran", "tarbiya", "tajweed", "maqraa", "playground"]),
  sheikhId: z.string().min(1, "اختر شيخاً"),
  notes: z.string().optional(),
});
type GroupForm = z.infer<typeof groupSchema>;

interface Sheikh {
  _id: string;
  name: string;
}
interface Student {
  _id: string;
  name: string;
}
interface Group {
  _id: string;
  name: string;
  activity: string;
  activityLabel: string;
  sheikh: Sheikh;
  students: Student[];
  notes?: string;
}

interface Props {
  groups: Group[];
  sheikhs: Sheikh[];
}

export function GroupsManager({ groups: initial, sheikhs }: Props) {
  const router = useRouter();
  // const [groups,  setGroups]  = useState(initial);
  const groups = initial;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GroupForm>({ resolver: zodResolver(groupSchema) });

  const openCreate = () => {
    reset({ name: "", activity: "quran", sheikhId: "", notes: "" });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (g: Group) => {
    reset({
      name: g.name,
      activity: g.activity as any,
      sheikhId: g.sheikh._id,
      notes: g.notes,
    });
    setEditing(g);
    setOpen(true);
  };

  const onSubmit = async (data: GroupForm) => {
    setLoading(true);
    try {
      const url = editing ? `/api/groups/${editing._id}` : "/api/groups";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("حدث خطأ");
        return;
      }
      toast.success(editing ? "تم تحديث المجموعة" : "تم إنشاء المجموعة");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف مجموعة "${name}"؟`)) return;
    await fetch(`/api/groups/${id}`, { method: "DELETE" });
    toast.success("تم الحذف");
    router.refresh();
  };

  // Group by activity
  const byActivity: Record<string, Group[]> = {};
  for (const g of groups) {
    if (!byActivity[g.activity]) byActivity[g.activity] = [];
    byActivity[g.activity].push(g);
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={16} className="ml-2" /> مجموعة جديدة
        </Button>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          لا توجد مجموعات — أضف مجموعة جديدة
        </div>
      )}

      {Object.entries(byActivity).map(([act, grps]) => (
        <div key={act} className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {ACT_LABELS[act as keyof typeof ACT_LABELS] ?? act}
            <Badge variant="secondary">{grps.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grps.map((g) => (
              <Card key={g._id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2 flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {g.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.sheikh.name}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(g)}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(g._id, g.name)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users size={12} />
                    <span>{g.students.length} طالب</span>
                  </div>
                  {g.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {g.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing ? "تعديل المجموعة" : "مجموعة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                اسم المجموعة <span className="text-destructive">*</span>
              </Label>
              <Input placeholder="المجموعة الأولى" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                النشاط <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue={editing?.activity ?? "quran"}
                onValueChange={(v) => setValue("activity", v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACT_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                الشيخ <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue={editing?.sheikh._id ?? ""}
                onValueChange={(v) => setValue("sheikhId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر شيخاً" />
                </SelectTrigger>
                <SelectContent>
                  {sheikhs.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sheikhId && (
                <p className="text-xs text-destructive">
                  {errors.sheikhId.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>ملاحظات</Label>
              <Textarea rows={2} {...register("notes")} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 size={14} className="animate-spin ml-2" />}
                {editing ? "حفظ" : "إنشاء"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
