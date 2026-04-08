// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@/lib/auth/options";
// import { redirect } from "next/navigation";
// import { connectDB } from "@/lib/db/connect";
// import Mosque from "@/models/Mosque";
// import Student from "@/models/Student";
// import Sheikh from "@/models/Sheikh";
// import Session from "@/models/Session";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// import { Building2, Users, Star, CalendarCheck } from "lucide-react";

// export const metadata = { title: "جميع المساجد" };

// export default async function AdminMosquesPage() {
//   const session = await auth();

//   // Only superadmin
//   if (session?.user.role !== "superadmin") redirect("/");

//   await connectDB();

//   const mosques = await Mosque.find().sort({ createdAt: -1 }).lean();
//   const ids = mosques.map((m) => m._id);

//   const [sc, shc, sec] = await Promise.all([
//     Student.aggregate([
//       { $match: { mosqueId: { $in: ids }, isActive: true } },
//       { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
//     ]),
//     Sheikh.aggregate([
//       { $match: { mosqueId: { $in: ids } } },
//       { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
//     ]),
//     Session.aggregate([
//       { $match: { mosqueId: { $in: ids } } },
//       { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
//     ]),
//   ]);

//   const toMap = (arr: any[]) =>
//     Object.fromEntries(arr.map((x) => [x._id.toString(), x.count]));

//   const students = toMap(sc);
//   const sheikhs = toMap(shc);
//   const sessions = toMap(sec);

//   // Global totals
//   const totalStudents = Object.values(students).reduce((a, b) => a + b, 0); // 'a' is of type 'unknown'.ts(18046)
//   const totalSheikhs = Object.values(sheikhs).reduce((a, b) => a + b, 0);// 'a' is of type 'unknown'.ts(18046)
//   const totalSessions = Object.values(sessions).reduce((a, b) => a + b, 0);// 'a' is of type 'unknown'.ts(18046)

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold">لوحة تحكم المساجد</h1>
//         <p className="text-muted-foreground text-sm">
//           {mosques.length} مسجد مسجل
//         </p>
//       </div>

//       {/* Global stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             label: "إجمالي المساجد",
//             value: mosques.length,
//             icon: Building2,
//             color: "text-primary",
//           },
//           {
//             label: "إجمالي الطلاب",
//             value: totalStudents,
//             icon: Users,
//             color: "text-blue-600",
//           },
//           {
//             label: "إجمالي المشايخ",
//             value: totalSheikhs,
//             icon: Star,
//             color: "text-gold",
//           },
//           {
//             label: "إجمالي الحلقات",
//             value: totalSessions,
//             icon: CalendarCheck,
//             color: "text-green-600",
//           },
//         ].map(({ label, value, icon: Icon, color }) => (
//           <Card key={label}>
//             <CardContent className="pt-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">{label}</p>
//                   <p className="text-3xl font-bold mt-1">{value}</p>

//                 </div>
//                 <Icon size={32} className={`${color} opacity-80`} />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Per-mosque table */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">تفاصيل المساجد</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="divide-y">
//             {mosques.map((m) => {
//               const mid = m._id.toString();
//               return (
//                 <div
//                   key={mid}
//                   className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
//                 >
//                   <div className="space-y-0.5">
//                     <p className="font-medium">{m.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {m.address ?? "—"} · تسجيل{" "}
//                       {new Date(m.createdAt).toLocaleDateString("ar-EG")}
//                     </p>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="text-center">
//                       <p className="text-lg font-bold">{students[mid] ?? 0}</p>
//                       <p className="text-xs text-muted-foreground">طالب</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-lg font-bold">{sheikhs[mid] ?? 0}</p>
//                       <p className="text-xs text-muted-foreground">شيخ</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-lg font-bold">{sessions[mid] ?? 0}</p>
//                       <p className="text-xs text-muted-foreground">حلقة</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { auth } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import Mosque from "@/models/Mosque";
import Student from "@/models/Student";
import Sheikh from "@/models/Sheikh";
import Session from "@/models/Session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Star, CalendarCheck } from "lucide-react";

export const metadata = { title: "جميع المساجد" };

interface MosqueStats {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  stats: { students: number; sheikhs: number; sessions: number };
}

export default async function AdminMosquesPage() {
  const session = await auth();
  if (session?.user.role !== "superadmin") redirect("/");

  await connectDB();

  const mosques = await Mosque.find().sort({ createdAt: -1 }).lean();
  const ids = mosques.map((m) => m._id);

  const [sc, shc, sec] = await Promise.all([
    Student.aggregate<{ _id: unknown; count: number }>([
      { $match: { mosqueId: { $in: ids }, isActive: true } },
      { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
    ]),
    Sheikh.aggregate<{ _id: unknown; count: number }>([
      { $match: { mosqueId: { $in: ids } } },
      { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
    ]),
    Session.aggregate<{ _id: unknown; count: number }>([
      { $match: { mosqueId: { $in: ids } } },
      { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
    ]),
  ]);

  const toMap = (
    arr: { _id: unknown; count: number }[],
  ): Record<string, number> =>
    Object.fromEntries(arr.map((x) => [String(x._id), x.count]));

  const studentMap = toMap(sc);
  const sheikhMap = toMap(shc);
  const sessionMap = toMap(sec);

  const totalStudents = sc.reduce((a, x) => a + x.count, 0);
  const totalSheikhs = shc.reduce((a, x) => a + x.count, 0);
  const totalSessions = sec.reduce((a, x) => a + x.count, 0);

  const data: MosqueStats[] = mosques.map((m) => {
    const mid = m._id.toString();
    return {
      _id: mid,
      name: m.name,
      address: m.address,
      phone: m.phone,
      createdAt: m.createdAt,
      stats: {
        students: studentMap[mid] ?? 0,
        sheikhs: sheikhMap[mid] ?? 0,
        sessions: sessionMap[mid] ?? 0,
      },
    };
  });

  const summaryCards = [
    {
      label: "إجمالي المساجد",
      value: mosques.length,
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "إجمالي الطلاب",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "إجمالي المشايخ",
      value: totalSheikhs,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "إجمالي الحلقات",
      value: totalSessions,
      icon: CalendarCheck,
      color: "text-green-600",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة تحكم المساجد</h1>
        <p className="text-muted-foreground text-sm">
          {mosques.length} مسجد مسجل
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <Icon size={32} className={`${color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-mosque list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">تفاصيل المساجد</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {data.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.address ?? "—"} · تسجيل{" "}
                    {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div className="flex gap-6">
                  {[
                    { label: "طالب", value: m.stats.students },
                    { label: "شيخ", value: m.stats.sheikhs },
                    { label: "حلقة", value: m.stats.sessions },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center min-w-10">
                      <p className="text-lg font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <p className="text-center py-10 text-muted-foreground">
                لا توجد مساجد مسجلة
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
