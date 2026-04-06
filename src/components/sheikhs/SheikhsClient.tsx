"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSheikhs, type SheikhItem } from "@/hooks/queries/useSheikhs";
import { useDeleteSheikh } from "@/hooks/mutations/useSheikhMutation";
import { Button } from "@/components/ui/button";
// import { Badge }           from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  UserPlus,
  Phone,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  // User,
  BookOpen,
} from "lucide-react";

const ACT_LABELS: Record<string, { label: string; color: string }> = {
  quran: {
    label: "قرآن",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  tarbiya: {
    label: "تربية",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  tajweed: {
    label: "تجويد",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  maqraa: {
    label: "مقرأة",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  playground: {
    label: "ملعب",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

interface Props {
  initialData: { sheikhs: SheikhItem[] };
}

export function SheikhsClient({ initialData }: Props) {
  const { data, isLoading } = useSheikhs(initialData);
  const { mutate: deleteSheikh, isPending: deleting } = useDeleteSheikh();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sheikhs = data?.sheikhs ?? [];

  const filtered = sheikhs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toDelete = sheikhs.find((s) => s._id === deleteId);

  return (
    <>
      {/* ── Header ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">المشايخ</h1>
            <p className="text-sm text-muted-foreground">
              {sheikhs.length} شيخ مسجل
            </p>
          </div>
          <Button asChild>
            <Link href="/sheikhs/new">
              <UserPlus size={16} className="ml-2" />
              إضافة شيخ
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="ابحث باسم الشيخ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            {search ? "لا توجد نتائج" : "لا يوجد مشايخ مسجلون بعد"}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sheikh) => (
            <SheikhCard
              key={sheikh._id}
              sheikh={sheikh}
              onDelete={() => setDeleteId(sheikh._id)}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الشيخ</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد حذف الشيخ <strong>{toDelete?.name}</strong>؟ لا يمكن
              التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteSheikh(deleteId);
                setDeleteId(null);
              }}
            >
              {deleting ? "جارٍ الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Sheikh Card ──────────────────────────────────────────────

interface CardProps {
  sheikh: SheikhItem;
  onDelete: () => void;
}

function SheikhCard({ sheikh, onDelete }: CardProps) {
  const act = sheikh.groupId ? ACT_LABELS[sheikh.groupId.activity] : null;

  return (
    <article
      className="
      group relative bg-card border border-border rounded-2xl
      overflow-hidden transition-all duration-200
      hover:shadow-md hover:-translate-y-0.5
    "
    >
      {/* Islamic geometric top accent */}
      <div
        className="
        h-1.5 w-full
        bg-gradient-to-r from-primary via-[var(--gold)] to-primary
      "
      />

      <div className="p-5">
        {/* Avatar + Name */}
        <div className="flex items-start gap-4">
          <div
            className="
            relative w-14 h-14 rounded-2xl overflow-hidden shrink-0
            bg-primary/8 border border-primary/15
            flex items-center justify-center
          "
          >
            {sheikh.photo ? (
              <Image
                src={sheikh.photo}
                alt={sheikh.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <span className="text-xl font-bold text-primary/60">
                {sheikh.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">
              {sheikh.name}
            </h3>
            {sheikh.phone && (
              <p
                className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"
                dir="ltr"
              >
                <Phone size={12} />
                {sheikh.phone}
              </p>
            )}
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/sheikhs/${sheikh._id}`}>
                  <Eye size={14} className="ml-2" /> عرض
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/sheikhs/${sheikh._id}/edit`}>
                  <Pencil size={14} className="ml-2" /> تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 size={14} className="ml-2" /> حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Group badge */}
        {sheikh.groupId && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen size={13} />
                <span className="truncate">{sheikh.groupId.name}</span>
              </div>
              {act && (
                <span
                  className={`
                  text-xs font-medium px-2 py-0.5 rounded-full border
                  ${act.color}
                `}
                >
                  {act.label}
                </span>
              )}
            </div>
          </div>
        )}

        {!sheikh.groupId && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              لا توجد مجموعة مرتبطة
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
