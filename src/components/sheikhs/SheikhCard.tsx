"use client";

import { Phone, Users, BookOpen } from "lucide-react";
import { deleteSheikhAction } from "@/lib/services/sheikh.actions";
import { DeleteButton } from "@/components/global/DeleteButton";
import type { SheikhWithGroups } from "@/types";
import ProfileImage from "../global/profileImage";
import EditButton from "../global/EditButton";
import ViewButton from "../global/ViewButton";

const ACT_THEMES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  quran: {
    label: "قرآن",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  tarbiya: {
    label: "تربية",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  tajweed: {
    label: "تجويد",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  maqraa: {
    label: "مقرأة",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  playground: {
    label: "ملعب",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

interface SheikhCardProps {
  sheikh: SheikhWithGroups;
}

export function SheikhCard({ sheikh }: SheikhCardProps) {
  return (
    <article className="group relative bg-white border border-emerald-100/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1">
      <div className="h-1.5 w-full bg-linear-to-r from-emerald-600 via-emerald-400 to-amber-400" />

      <div className="p-5">
        <div className="flex items-start gap-4 mb-5">
          <ProfileImage photo={sheikh.photo} name={sheikh.name} />
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {sheikh.name}
            </h3>
            {sheikh.phone ? (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5 font-medium">
                <Phone size={12} className="text-emerald-500" />
                {sheikh.phone}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1.5">لا يوجد رقم هاتف</p>
            )}
          </div>
        </div>

        {/* ── المجموعات (Groups) ── */}
        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 min-h-22.5">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-gray-500">
            <BookOpen size={13} className="text-amber-500" />
            <span>المجموعات الحالية ({sheikh.groups.length})</span>
          </div>

          {sheikh.groups.length > 0 ? (
            <div className="space-y-2">
              {sheikh.groups.slice(0, 3).map((g) => {
                const theme = ACT_THEMES[g.activity] || {
                  label: g.activity,
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                  border: "border-gray-200",
                };
                return (
                  <div
                    key={g._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span
                      className={`font-medium ${theme.text}`}
                      title={g.name}
                    >
                      {g.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${theme.bg} ${theme.text} ${theme.border}`}
                      >
                        {theme.label}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center gap-1">
                        <Users size={10} /> {g.studentCount}
                      </span>
                    </div>
                  </div>
                );
              })}
              {sheikh.groups.length > 3 && (
                <p className="text-xs text-center text-emerald-600 font-medium pt-1">
                  + {sheikh.groups.length - 3} مجموعات أخرى
                </p>
              )}
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center text-xs text-gray-400">
              لا توجد مجموعات مسندة
            </div>
          )}
        </div>

        {/* ── الإجراءات (Actions) ── */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <ViewButton href={`/sheikhs/${sheikh._id}`} />

            <EditButton href={`/sheikhs/${sheikh._id}/edit`} />
          </div>

          <div className="shrink-0 pl-1 border-r border-gray-100">
            <DeleteButton
              name={sheikh.name}
              id={sheikh._id}
              handleDelete={deleteSheikhAction}
              deletedItem="sheikh"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
