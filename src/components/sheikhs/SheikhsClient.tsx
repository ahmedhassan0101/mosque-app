"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheikhCard } from "./SheikhCard";
import type { SheikhWithGroups } from "@/types";

interface SheikhsClientProps {
  sheikhs: SheikhWithGroups[];
}

export function SheikhsClient({ sheikhs }: SheikhsClientProps) {

  const [search, setSearch] = useState("");

  const filtered = sheikhs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 flex items-center gap-2">
            إدارة المشايخ والمحفظين
          </h1>
          <p className="text-sm text-emerald-700/80 mt-1 font-medium">
            يوجد {sheikhs.length} شيخ مسجل في النظام
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/60"
            />
            <Input
              placeholder="ابحث باسم الشيخ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 bg-white border-emerald-100 focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm shadow-emerald-200">
            <Link href="/sheikhs/new">
              <UserPlus size={18} className="ml-2" />
              إضافة شيخ
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Grid Section ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-emerald-900">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "لم يتم العثور على شيخ بهذا الاسم." : "لا يوجد مشايخ مسجلون بعد. ابدأ بإضافة شيخ جديد."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((sheikh) => (
            <SheikhCard key={sheikh._id} sheikh={sheikh} />
          ))}
        </div>
      )}
    </div>
  );
}