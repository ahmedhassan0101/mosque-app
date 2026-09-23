"use client";
import React, { useState } from "react";
import { 
  Check, X, Clock, AlertCircle, Sparkles, 
  Calendar, User, BookOpen, Save, Tag 
} from "lucide-react";

// نموذج بيانات وهمي للطلاب في المجموعة
const initialStudents = [
  { id: "1", name: "أحمد يسري منصور", status: "present", rating: "excellent", note: "" },
  { id: "2", name: "أدهم محمود دياب", status: "present", rating: "good", note: "" },
  { id: "3", name: "حسن طارق السقا", status: "absent", rating: "", note: "بدون عذر" },
  { id: "4", name: "عمر سامح رفعت", status: "late", rating: "average", note: "تأخر 20 دقيقة" },
  { id: "5", name: "أسماء طارق لطفي", status: "excused", rating: "", note: "بعذر مرضي" },
];

export default function AttendanceForm() {
  const [students, setStudents] = useState(initialStudents);
  const [behaviorTags, setBehaviorTags] = useState<string[]>(["excellent"]);

  // تغيير حالة حضور طالب
  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  // تغيير تقييم طالب فردي
  const handleRatingChange = (studentId: string, rating: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, rating } : s))
    );
  };

  // زر تحضير الجميع بنقرة واحدة
  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: "present" })));
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* ── 1. Session Header Info ─────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              القرآن الكريم
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">حلقة الفجر - تسجيل الجلسة</h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>21 سبتمبر 2026</span>
          </div>
        </div>

        {/* معلومات الجلسة الأساسية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">المعلم:</span>
            <span className="font-semibold text-slate-700">الشيخ إبراهيم الدسوقي</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">المجموعة:</span>
            <span className="font-semibold text-slate-700">مجموعة أ (12 طالب)</span>
          </div>
        </div>
      </div>

      {/* ── 2. Content & Behavior Section ──────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          محتوى الجلسة وانضباط الحلقه العام
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">من سورة / آية</label>
            <input 
              type="text" 
              placeholder="مثال: البقرة (آية 1)" 
              className="w-full text-sm border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">إلى سورة / آية</label>
            <input 
              type="text" 
              placeholder="مثال: البقرة (آية 50)" 
              className="w-full text-sm border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* تقييم سلوك الحلقة العام */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> تقييم انضباط الحلقة العام:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "excellent", label: "ممتاز ✨" },
              { id: "good", label: "جيد 👍" },
              { id: "noisy", label: "ضوضاء / شغب 🔊" },
              { id: "late_start", label: "تأخر البدء 🕒" },
            ].map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  setBehaviorTags(prev => 
                    prev.includes(tag.id) ? prev.filter(t => t !== tag.id) : [...prev, tag.id]
                  );
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  behaviorTags.includes(tag.id)
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Student Attendance List (The Core UI) ───────────────── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        
        {/* Header Control */}
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-slate-800 text-base">سجل كشف الطلاب</h2>
            <p className="text-xs text-slate-500">حدد حالة كل طالب وتقييمه الفردي في الجلسة</p>
          </div>
          <button
            type="button"
            onClick={markAllPresent}
            className="text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            تحضير جميع الطلاب
          </button>
        </div>

        {/* Student Cards List */}
        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <div key={student.id} className="p-4 hover:bg-slate-50/60 transition-colors space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* اسم الطالب */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-600 text-sm flex items-center justify-center border">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{student.name}</h3>
                    {/* عرض الملاحظة إن وجدت */}
                    {student.note && (
                      <span className="text-xs text-amber-600 font-medium">{student.note}</span>
                    )}
                  </div>
                </div>

                {/* أزرار اختيار الحالة (Status Switcher) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit border">
                  
                  {/* حاضر */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "present")}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      student.status === "present"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    حاضر
                  </button>

                  {/* غائب */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "absent")}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      student.status === "absent"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    غائب
                  </button>

                  {/* مستأذن */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "excused")}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      student.status === "excused"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    مستأذن
                  </button>

                  {/* متأخر */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, "late")}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      student.status === "late"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    متأخر
                  </button>

                </div>
              </div>

              {/* تفاصيل إضافية للطالب (تظهر بشكل خفيف إذا كان الطالب حاضراً أو متأخراً) */}
              {(student.status === "present" || student.status === "late") && (
                <div className="flex items-center gap-3 pt-1 text-xs border-t border-dashed border-slate-100">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> التقييم:
                  </span>
                  
                  {/* أزرار التقييم الفردي */}
                  {["excellent", "good", "average", "weak"].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRatingChange(student.id, r)}
                      className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors ${
                        student.rating === r
                          ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {r === "excellent" ? "ممتاز" : r === "good" ? "جيد" : r === "average" ? "متوسط" : "ضعيف"}
                    </button>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Submit Action Bar ────────────────────────────────────── */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border shadow-lg flex justify-between items-center">
        <div className="text-xs text-slate-500">
          تم تحضير <strong className="text-emerald-600">{students.filter(s => s.status === 'present').length}</strong> من أصل <strong className="text-slate-800">{students.length}</strong> طالب
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-emerald-200"
        >
          <Save className="w-4 h-4" />
          حفظ الجلسة والتسجيل
        </button>
      </div>

    </div>
  );
}