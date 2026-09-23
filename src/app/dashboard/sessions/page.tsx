/* eslint-disable react/no-unescaped-entities */
import { ACTIVITIES } from "@/constants";
import { getSessionsList } from "@/queries/session.queries";
import {
  Check,
  X,
  AlertCircle,
  Calendar as CalendarIcon,
  User,
  TrendingUp,
  AlertTriangle,
  Users,
  UserMinus,
  UserCheck,
  Tag,
  BookOpen,
  Calendar,

} from "lucide-react";
import AttendanceForm from "./AttendanceForm";



const sessionsData = [
  {
    _id: "6a04752bf96aad96b9dff332",
    mosqueId: "69f07d4f5acfe7b2fa1de77e",
    groupId: {
      _id: "69fb1c322d5e082f78030c11",
      name: "حلقة الفجر",
    },
    activity: "quran",
    date: "2026-04-30T00:00:00.000Z",
    teacherId: {
      _id: "69fb1c312d5e082f78030be5",
      name: "الشيخ إبراهيم الدسوقي",
    },
    recordedBy: "69f07d325acfe7b2fa1de77b",
    attendedStudentIds: [
      {
        _id: "69fb1c312d5e082f78030bf2",
        name: "ملك مصطفى الجندي",
      },
    ],
    content: {
      title: "",
      book: "",
      fromSurah: "",
      toSurah: "",
    },
    behaviorTags: ["average", "noisy", "low_attendance"],
    notes: "gcvgmvj,",
    __v: 0,
    createdAt: "2026-05-13T12:57:15.996Z",
    updatedAt: "2026-05-13T12:57:15.996Z",
  },
  {
    _id: "6a04752bf96aad96b9dff333",
    mosqueId: "69f07d4f5acfe7b2fa1de77e",
    groupId: {
      _id: "6a03f673f96aad96b9dff285",
      name: "حلقة الاربعاء",
    },
    activity: "quran",
    date: "2026-04-30T00:00:00.000Z",
    teacherId: {
      _id: "69fb1c312d5e082f78030be5",
      name: "الشيخ إبراهيم الدسوقي",
    },
    recordedBy: "69f07d325acfe7b2fa1de77b",
    attendedStudentIds: [
      {
        _id: "69fb1c312d5e082f78030c0f",
        name: "أحمد يسري منصور",
      },
      {
        _id: "69fb1c312d5e082f78030bff",
        name: "أدهم محمود دياب",
      },
      {
        _id: "69fb1c312d5e082f78030bf0",
        name: "حسن طارق السقا",
      },
      {
        _id: "69fb1c312d5e082f78030c09",
        name: "حسن طارق السقا",
      },
      {
        _id: "69fb1c312d5e082f78030bee",
        name: "عمر سامح رفعت",
      },
    ],
    content: {
      title: "",
      book: "",
      fromSurah: "",
      toSurah: "",
    },
    behaviorTags: ["excellent"],
    notes: "gcvgmvj,",
    __v: 0,
    createdAt: "2026-05-13T12:57:15.998Z",
    updatedAt: "2026-05-13T13:12:00.225Z",
  },
  {
    _id: "6a25ee218fa68db6be6159ac",
    mosqueId: "69f07d4f5acfe7b2fa1de77e",
    groupId: {
      _id: "6a03f673f96aad96b9dff285",
      name: "حلقة الاربعاء",
    },
    activity: "quran",
    date: "2026-06-03T00:00:00.000Z",
    teacherId: {
      _id: "69fb1c312d5e082f78030be3",
      name: "الشيخ محمد الشناوي",
    },
    recordedBy: "69f07d325acfe7b2fa1de77b",
    attendedStudentIds: [
      {
        _id: "69fb1c312d5e082f78030c0f",
        name: "أحمد يسري منصور",
      },
      {
        _id: "69fb1c312d5e082f78030bed",
        name: "أسماء طارق لطفي",
      },
      {
        _id: "69fb1c312d5e082f78030bf0",
        name: "حسن طارق السقا",
      },
      {
        _id: "69fb1c312d5e082f78030bee",
        name: "عمر سامح رفعت",
      },
    ],
    content: {
      title: "",
      book: "",
      fromSurah: "",
      toSurah: "",
    },
    behaviorTags: ["low_attendance", "noisy"],
    notes: "",
    __v: 0,
    createdAt: "2026-06-07T22:18:09.144Z",
    updatedAt: "2026-06-07T22:18:09.144Z",
  },
  {
    _id: "6ab0b8a0c992ef0ec1cf842a",
    mosqueId: "69f07d4f5acfe7b2fa1de77e",
    groupId: {
      _id: "69fb1c322d5e082f78030c12",
      name: "حلقة التجويد الأساسية",
    },
    activity: "tajweed",
    date: "2026-09-19T00:00:00.000Z",
    teacherId: {
      _id: "69fb1c312d5e082f78030be4",
      name: "الشيخ محمود البنا",
    },
    recordedBy: "69f07d325acfe7b2fa1de77b",
    attendedStudentIds: [
      {
        _id: "69fb1c312d5e082f78030be9",
        name: "محمد رمضان الشاذلي",
      },
      {
        _id: "69fb1c312d5e082f78030bee",
        name: "عمر سامح رفعت",
      },
      {
        _id: "69fb1c312d5e082f78030bf3",
        name: "مصطفى أيمن عبدربه",
      },
      {
        _id: "69fb1c312d5e082f78030bf8",
        name: "محمد رجب سلامة",
      },
      {
        _id: "69fb1c312d5e082f78030c02",
        name: "محمد رمضان الشاذلي",
      },
    ],
    content: {
      title: "تابع أحكام اللامات",
      book: "بحث واجتهاد",
      fromSurah: "",
      toSurah: "",
    },
    behaviorTags: ["low_attendance", "late_start", "average"],
    notes: "",
    __v: 0,
    createdAt: "2026-09-21T04:54:56.194Z",
    updatedAt: "2026-09-21T04:54:56.194Z",
  },
  {
    _id: "6ab0bf7cc992ef0ec1cf84bd",
    mosqueId: "69f07d4f5acfe7b2fa1de77e",
    groupId: {
      _id: "69fb1c322d5e082f78030c13",
      name: "جلسة التربية الأسبوعية",
    },
    activity: "tarbiya",
    date: "2026-09-20T00:00:00.000Z",
    teacherId: {
      _id: "69fb1c312d5e082f78030be2",
      name: "الشيخ أحمد عبدالتواب",
    },
    recordedBy: "69f07d325acfe7b2fa1de77b",
    attendedStudentIds: [
      {
        _id: "69fb1c312d5e082f78030bea",
        name: "محمود عبدالعزيز حسن",
      },
      {
        _id: "69fb1c312d5e082f78030bef",
        name: "علي جمال الدين",
      },
      {
        _id: "69fb1c312d5e082f78030bf4",
        name: "خالد محسن الشافعي",
      },
      {
        _id: "69fb1c312d5e082f78030bf9",
        name: "شريف سيد كامل",
      },
      {
        _id: "69fb1c312d5e082f78030bfe",
        name: "سيف أحمد الجمال",
      },
      {
        _id: "69fb1c312d5e082f78030c03",
        name: "محمود عبدالعزيز حسن",
      },
      {
        _id: "69fb1c312d5e082f78030c08",
        name: "علي جمال الدين",
      },
      {
        _id: "69fb1c312d5e082f78030c0d",
        name: "خالد محسن الشافعي",
      },
      {
        _id: "69fb1c312d5e082f78030c0f",
        name: "أحمد يسري منصور",
      },
    ],
    content: {
      title: "اي درس",
      book: "أي كتاب",
      fromSurah: "",
      toSurah: "",
    },
    behaviorTags: ["excellent", "late_start"],
    notes:
      'اذا خرجت من منزلك لدراستك أو عملك \nأو لتوصيل أبنائك لمدارسهم لا تخرج إلا أن تقول؛ \n "بسم الله توكلت على الله ولا حول ولا قوة إلا بالله" \nفيرد عليك ملك يقول "هُديت وكُفيت ووقيت " وليس ذلك فحسب بل يتنحى عنك الشيطان',
    __v: 0,
    createdAt: "2026-09-21T05:24:12.146Z",
    updatedAt: "2026-09-21T05:24:12.146Z",
  },
];
const getBehaviorBadge = (tag: string) => {
  const tagsMap: Record<string, { label: string; color: string }> = {
    excellent: { label: "ممتاز", color: "bg-emerald-100 text-emerald-700" },
    average: { label: "متوسط", color: "bg-amber-100 text-amber-700" },
    noisy: { label: "فوضى", color: "bg-red-100 text-red-700" },
    low_attendance: {
      label: "حضور ضعيف",
      color: "bg-orange-100 text-orange-700",
    },
    late_start: {
      label: "بداية متأخرة",
      color: "bg-purple-100 text-purple-700",
    },
  };
  return tagsMap[tag] || { label: tag, color: "bg-slate-100 text-slate-700" };
};
export default async function Page() {
  const sessions = await getSessionsList();
  if (!sessions) return null;

  return (
    <div dir="ltr">
      <AttendanceForm />
      <div dir="rtl" className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              يوميات الحلقات
            </h2>
            <p className="text-sm text-slate-500">
              سجل الجلسات المنعقدة وتفاصيل المحتوى المدرس.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {sessionsData.map((session) => {
            // تنسيق التاريخ
            const sessionDate = new Date(session.date).toLocaleDateString(
              "ar-EG",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            );

            return (
              <div
                key={session._id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header: Date & Group */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {session.groupId.name}
                      </h3>
                      <span className="text-sm font-medium text-slate-500">
                        {sessionDate}
                      </span>
                    </div>
                  </div>
                  {/* Activity Badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {session.activity === "quran"
                      ? "قرآن كريم"
                      : session.activity === "tajweed"
                        ? "تجويد"
                        : session.activity}
                  </span>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {/* Teacher */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">المعلم:</span>
                    <span className="font-semibold text-slate-800">
                      {session.teacherId.name}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">المحتوى:</span>
                    <span className="font-semibold text-slate-800">
                      {session.content.title ||
                        session.content.book ||
                        "لم يتم تسجيل محتوى"}
                    </span>
                  </div>

                  {/* Attendees */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">الحضور:</span>
                    <span className="font-bold text-indigo-600">
                      {session.attendedStudentIds.length} طلاب
                    </span>
                  </div>
                </div>

                {/* Footer: Tags & Notes */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-slate-400" />
                    {session.behaviorTags.map((tag) => {
                      const badge = getBehaviorBadge(tag);
                      return (
                        <span
                          key={tag}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>

                  {session.notes && (
                    <p className="text-sm text-slate-500 italic bg-white px-3 py-1 border rounded-md">
                      " {session.notes} "
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        dir="rtl"
        className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen"
      >
        {/* ── Header & Date Filter ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              نظرة عامة على الحضور
            </h1>
            <p className="text-slate-500 mt-1">
              إحصائيات الحضور لجميع الأنشطة والمجموعات.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 shadow-sm">
            <CalendarIcon className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              اليوم: 21 سبتمبر 2026
            </span>
          </div>
        </div>

        {/* ── 1. Top KPIs (إحصائيات اليوم الكلية) ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                إجمالي المتوقع حضورهم
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                1,200{" "}
                <span className="text-sm font-normal text-slate-400">طالب</span>
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">حضور اليوم</p>
              <h3 className="text-2xl font-bold text-slate-800">
                1,050{" "}
                <span className="text-sm font-normal text-emerald-600">
                  (87.5%)
                </span>
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <UserMinus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">غياب اليوم</p>
              <h3 className="text-2xl font-bold text-slate-800">
                150{" "}
                <span className="text-sm font-normal text-red-500">
                  (12.5%)
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* ── 2. The 5 Activities Breakdown (تحليل الأنشطة الخمسة) ─────── */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              معدلات الحضور حسب النشاط (اليوم)
            </h2>
            <button className="text-sm text-emerald-600 font-medium hover:underline">
              عرض التقارير المفصلة
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* List of Activities with Progress Bars */}
            <div className="space-y-6">
              {/* القرآن */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">
                    القرآن الكريم
                  </span>
                  <span className="text-slate-500">
                    حضور: <strong className="text-emerald-600">92%</strong>{" "}
                    (460/500)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              {/* التجويد */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">التجويد</span>
                  <span className="text-slate-500">
                    حضور: <strong className="text-emerald-600">85%</strong>{" "}
                    (170/200)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              {/* التربية */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">
                    التربية الإسلامية
                  </span>
                  <span className="text-slate-500">
                    حضور: <strong className="text-amber-500">75%</strong>{" "}
                    (150/200)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              {/* المقرأة */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">المقرأة</span>
                  <span className="text-slate-500">
                    حضور: <strong className="text-emerald-600">95%</strong>{" "}
                    (95/100)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>

              {/* الملعب */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">
                    الملعب والأنشطة
                  </span>
                  <span className="text-slate-500">
                    حضور: <strong className="text-red-500">60%</strong>{" "}
                    (120/200)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-red-400 h-full rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Graphical summary or call to action could go here. Keeping it empty/placeholder for balance */}
            <div className="bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center p-6 flex-col text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-slate-500 w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-700">
                الأداء العام مستقر
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                نسبة الحضور اليوم تتطابق مع متوسط الحضور خلال الأسبوع الماضي.
                نشاط &quot;الملعب&quot; يحتاج لمتابعة.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Actionable Alerts (تنبيهات الغياب المتكرر) ────────────── */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-red-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">
                  تنبيهات الغياب المتكرر
                </h2>
                <p className="text-sm text-red-600/80">
                  طلاب تجاوزوا 3 غيابات متتالية ويحتاجون لتواصل فوري.
                </p>
              </div>
            </div>
          </div>

          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">اسم الطالب</th>
                <th className="px-6 py-4 font-semibold">المجموعة / النشاط</th>
                <th className="px-6 py-4 font-semibold">
                  عدد الغيابات المتتالية
                </th>
                <th className="px-6 py-4 font-semibold">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">
                  زياد محمد مصطفى
                </td>
                <td className="px-6 py-4 text-slate-600">التربية - مجموعة ج</td>
                <td className="px-6 py-4 font-bold text-red-600">4 مرات</td>
                <td className="px-6 py-4">
                  <button className="text-emerald-600 font-medium hover:underline text-xs">
                    عرض الملف والتواصل
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">
                  عمار ياسر
                </td>
                <td className="px-6 py-4 text-slate-600">القرآن - مجموعة أ</td>
                <td className="px-6 py-4 font-bold text-red-600">3 مرات</td>
                <td className="px-6 py-4">
                  <button className="text-emerald-600 font-medium hover:underline text-xs">
                    عرض الملف والتواصل
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div dir="rtl" className="max-w-7xl mx-auto p-6 space-y-12">
        {/* =========================================================================
          تصور 1: صفحة عرض غياب مجموعة معينة (Matrix View)
          الهدف: عرض سجل شهر/أسبوع للطلاب في نشاط معين (مثال: قرآن - مجموعة أ)
          ========================================================================= */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                سجل حضور: القرآن الكريم (مجموعة أ)
              </h2>
              <p className="text-sm text-slate-500">
                شهر أكتوبر 2026 • المشرف: الشيخ أحمد
              </p>
            </div>
            <select className="border rounded-md px-3 py-2 text-sm bg-white">
              <option>الأسبوع الحالي</option>
              <option>أكتوبر 2026</option>
              <option>سبتمبر 2026</option>
            </select>
          </div>

          <div className="border rounded-xl bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold sticky right-0 bg-slate-50 z-10 border-l">
                    اسم الطالب
                  </th>
                  {/* أعمدة الأيام (تأتي ديناميكياً من الـ JSON) */}
                  <th className="px-4 py-3 font-medium text-center">
                    01 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    03 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    05 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    08 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    09 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    11 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    13 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    15 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    17 أكتوبر
                  </th>
                  <th className="px-4 py-3 font-semibold text-center border-r bg-emerald-50">
                    نسبة الحضور
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* طالب 1 */}
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium sticky right-0 bg-white border-l">
                    عمر أحمد
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center border-r font-bold text-emerald-600">
                    75%
                  </td>
                </tr>
                {/* طالب 2 */}
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium sticky right-0 bg-white border-l">
                    يوسف محمود
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AlertCircle className="inline w-5 h-5 text-amber-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AlertCircle className="inline w-5 h-5 text-amber-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="inline w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AlertCircle className="inline w-5 h-5 text-amber-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <X className="inline w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-center border-r font-bold text-amber-600">
                    25%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
          تصور 2: صفحة الطالب الفردية (Student Profile - Attendance Section)
          الهدف: تحليل التزام طالب واحد في جميع أنشطته
          ========================================================================= */}
        <section className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-slate-800">
            الملف الشخصي: التزام الطالب (عمر أحمد)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* إجمالي الحضور */}
            <div className="border rounded-xl bg-white p-6 shadow-sm flex flex-col items-center justify-center space-y-2">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">85%</span>
              </div>
              <p className="text-slate-500 font-medium mt-2">
                إجمالي الالتزام هذا الشهر
              </p>
            </div>

            {/* تفصيل الأنشطة */}
            <div className="border rounded-xl bg-white p-6 shadow-sm md:col-span-2 space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">
                معدل الحضور حسب النشاط
              </h3>

              <div className="space-y-3">
                {/* نشاط 1 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">
                      القرآن الكريم (مجموعة أ)
                    </span>
                    <span className="text-emerald-600 font-bold">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>

                {/* نشاط 2 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">التربية الإسلامية</span>
                    <span className="text-amber-600 font-bold">60%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                {/* نشاط 3 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">النشاط الرياضي (الملعب)</span>
                    <span className="text-emerald-600 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <pre dir="ltr">
        <code>{JSON.stringify(sessions, null, 2)}</code>
      </pre>
    </div>
  );
}
