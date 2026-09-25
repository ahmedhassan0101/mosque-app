"use client";

import React, { useState } from "react";
import {
  FileSignature,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  MessageSquare,
  User,
  X,
} from "lucide-react";

// --- Mock Data ---
const mockReports = [
  {
    id: "rep-001",
    month: "أغسطس 2026",
    teacherName: "أ. محمود",
    progressTrend: "up",
    memorization: { surah: "البقرة", ayahFrom: 1, ayahTo: 141 },
    tajweed: "ممتاز",
    notes: "تقدم ملحوظ في الحفظ الجديد ومخارج الحروف منضبطة.",
    createdAt: "2026-08-30",
  },
  {
    id: "rep-002",
    month: "يوليو 2026",
    teacherName: "أ. محمود",
    progressTrend: "stable",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 50 },
    tajweed: "جيد",
    notes: "حفظ جيد ولكن يحتاج للتركيز أكثر على أحكام المدود.",
    createdAt: "2026-07-28",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
  {
    id: "rep-003",
    month: "يونيو 2026",
    teacherName: "أ. علي",
    progressTrend: "down",
    memorization: { surah: "آل عمران", ayahFrom: 1, ayahTo: 15 },
    tajweed: "يحتاج تدريب",
    notes: "معدل الحفظ بطيء هذا الشهر، تم التنبيه على الطالب.",
    createdAt: "2026-06-25",
  },
];

export default function MonthlyReports() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <FileSignature size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              سجل الحفظ الشهري
            </h2>
            <p className="text-xs text-muted-foreground">
              تتبع الإنجاز والتجويد
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isFormOpen
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          }`}
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "إغلاق" : "إضافة تقرير"}
        </button>
      </div>

      {/* Add Report Form */}
      {isFormOpen && (
        <div className="bg-muted/30 border border-border p-5 rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1: Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  الشهر التقييمي
                </label>
                <input
                  type="month"
                  className="w-full p-2.5 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  اسم المعلم
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute right-3 top-3 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="مثال: أ. محمود"
                    className="w-full p-2.5 pr-9 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  مؤشر التقدم
                </label>
                <select className="w-full p-2.5 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option value="up">🚀 يتقدم</option>
                  <option value="stable">⚖️ مستقر</option>
                  <option value="down">📉 متراجع</option>
                </select>
              </div>
            </div>

            {/* Row 2: Quran & Tajweed */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background p-4 rounded-lg border border-border">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  السورة
                </label>
                <input
                  type="text"
                  placeholder="البقرة"
                  className="w-full p-2 text-sm rounded-md border border-input bg-background outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  من آية
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full p-2 text-sm rounded-md border border-input bg-background outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  إلى آية
                </label>
                <input
                  type="number"
                  placeholder="141"
                  className="w-full p-2 text-sm rounded-md border border-input bg-background outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  تقييم التجويد
                </label>
                <select className="w-full p-2 text-sm rounded-md border border-input bg-background outline-none focus:border-primary">
                  <option>ممتاز</option>
                  <option>جيد جداً</option>
                  <option>جيد</option>
                  <option>يحتاج تدريب</option>
                </select>
              </div>
            </div>

            {/* Row 3: Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <MessageSquare size={14} /> ملاحظات المعلم
              </label>
              <textarea
                rows={2}
                placeholder="أضف أي ملاحظات حول أداء الطالب في الحفظ..."
                className="w-full p-3 text-sm rounded-md border border-input bg-background resize-none focus:ring-1 focus:ring-primary outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                حفظ التقرير
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History List Container (Scrollable Box) */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            التقارير السابقة
          </h3>
        </div>

        {/* Scroll Area with custom Tailwind scrollbar classes */}
        <div className="max-h-[450px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
          <div className="p-4 space-y-3">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted/10 transition-colors"
              >
                {/* Trend Color Indicator Strip */}
                <div
                  className={`absolute inset-y-0 start-0 w-1 rounded-s-xl ${
                    report.progressTrend === "up"
                      ? "bg-emerald-500"
                      : report.progressTrend === "down"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                />

                {/* Left Section: Meta (Month, Teacher) */}
                <div className="sm:w-[140px] shrink-0 flex flex-col gap-1.5 ps-2">
                  <span className="text-sm font-bold text-foreground">
                    {report.month}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User size={12} />
                    <span>{report.teacherName}</span>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.progressTrend === "up"
                          ? "bg-emerald-50 text-emerald-700"
                          : report.progressTrend === "down"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {report.progressTrend === "up" && (
                        <>
                          <TrendingUp size={10} /> يتقدم
                        </>
                      )}
                      {report.progressTrend === "stable" && (
                        <>
                          <Minus size={10} /> مستقر
                        </>
                      )}
                      {report.progressTrend === "down" && (
                        <>
                          <TrendingDown size={10} /> متراجع
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Middle Section: Quran Data */}
                <div className="flex-1 min-w-[200px] flex flex-col justify-center border-t sm:border-t-0 sm:border-r border-border pt-3 sm:pt-0 sm:pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={14} className="text-primary/70" />
                    <span className="text-sm font-semibold text-foreground">
                      سورة {report.memorization.surah}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    الآيات: من {report.memorization.ayahFrom} إلى{" "}
                    {report.memorization.ayahTo}
                  </p>
                  <span className="w-fit text-[11px] font-medium bg-muted px-2 py-0.5 rounded-md text-foreground">
                    التجويد: {report.tajweed}
                  </span>
                </div>

                {/* Right Section: Notes */}
                <div className="sm:w-[250px] shrink-0 flex flex-col justify-center bg-muted/30 p-2.5 rounded-lg border border-border/50">
                  <p
                    className="text-xs text-muted-foreground leading-relaxed line-clamp-3"
                    title={report.notes}
                  >
                    "{report.notes}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
