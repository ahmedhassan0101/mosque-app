"use client";

import React from "react";
import {
  User,
  BookOpen,
  Star,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- Mock Data ---
const studentData = {
  name: "أحمد حسن",
  id: "STU-2026-089",
  group: "مجموعة التحفة السنية - متقدم",
  center: "معهد الصوالحة",
  teacher: "أ. محمود",
  status: "نشط",
  kpis: {
    attendanceRate: 92,
    completedSessions: 45,
    behaviorRating: "ممتاز",
  },
};

const weeklyAttendance = [
  { name: "الأسبوع 1", sessions: 4 },
  { name: "الأسبوع 2", sessions: 5 },
  { name: "الأسبوع 3", sessions: 3 },
  { name: "الأسبوع 4", sessions: 5 },
];

const timeline = [
  {
    id: 1,
    date: "28 أغسطس 2026",
    type: "اختبار",
    title: "اختبار التحفة السنية",
    description: "إتمام المراجعة النهائية واجتياز الاختبار بنجاح.",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    id: 2,
    date: "25 أغسطس 2026",
    type: "مقرأة",
    title: "مراجعة نحوية وتطبيق",
    description: "تسميع ومناقشة باب المرفوعات من الأسماء.",
    icon: BookOpen,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
  {
    id: 3,
    date: "22 أغسطس 2026",
    type: "تجويد",
    title: "تطبيق عملي",
    description: "تصحيح تلاوة سورة الملك مع التركيز على أحكام المدود.",
    icon: Star,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
];

export default function StudentDashboard() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={40} />
          </div>
          <div className="flex-1 text-center md:text-right space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {studentData.name}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {studentData.id} • {studentData.center}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 w-fit mx-auto md:mx-0">
                <CheckCircle2 size={16} />
                {studentData.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 pt-2 border-t border-slate-50">
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} className="text-indigo-500" />
                المجموعة: {studentData.group}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={16} className="text-indigo-500" />
                المعلم: {studentData.teacher}
              </span>
            </div>
          </div>
        </div>

        {/* --- KPIs Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">نسبة الحضور</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {studentData.kpis.attendanceRate}%
                </h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +2% هذا الشهر
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">الجلسات المنجزة</p>
              <h3 className="text-2xl font-bold">
                {studentData.kpis.completedSessions}{" "}
                <span className="text-sm font-normal text-slate-400">جلسة</span>
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">التقييم السلوكي</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {studentData.kpis.behaviorRating}
              </h3>
            </div>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Column (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Clock size={20} className="text-indigo-500" />
              سجل النشاط الأخير
            </h2>
            <div className="relative border-r-2 border-slate-100 pr-6 space-y-8 mr-2">
              {timeline.map((item) => (
                <div key={item.id} className="relative">
                  <div
                    className={`absolute -right-[35px] h-8 w-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${item.bgColor} ${item.color}`}
                  >
                    <item.icon size={14} />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md ${item.bgColor} ${item.color}`}
                        >
                          {item.type}
                        </span>
                        <h4 className="font-semibold text-slate-800">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics & Notes Column */}
          <div className="space-y-6">
            {/* Chart Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                <TrendingUp size={20} className="text-indigo-500" />
                معدل الحضور الشهري
              </h2>
              <div className="h-48 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyAttendance}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <Tooltip
                      cursor={{ fill: "#f1f5f9" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="sessions"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Teacher Notes */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-md font-bold mb-3 flex items-center gap-2 text-indigo-900">
                <AlertCircle size={18} className="text-indigo-600" />
                ملاحظة المعلم
              </h2>
              <p className="text-sm text-indigo-800/80 leading-relaxed">
                "أداء ممتاز في الحفظ والمراجعة خلال الفترة الماضية. نرجو التركيز
                على مراجعة أحكام المد المتصل في اللقاء القادم استعداداً لاختبار
                نهاية الشهر."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
