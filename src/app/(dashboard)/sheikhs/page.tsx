/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\(dashboard)\sheikhs\page.tsx

import { auth } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import "@/models/Group"; // register for populate
import { SheikhsClient } from "@/components/sheikhs/SheikhsClient";

export const metadata = { title: "المشايخ" };

/**
 * Server Component:
 * 1. Fetch data directly from DB (faster and better for SSR)
 * 2. Pass it as initialData to the Client Component
 *    to avoid extra requests on first render
 */
export default async function SheikhsPage() {
  const session = await auth();
  const mosqueId = session?.user.mosqueId;
  if (!mosqueId) return null;

  await connectDB();

  const sheikhs = await Sheikh.find({ mosqueId })
    .populate("groupId", "name activity")
    .sort({ name: 1 })
    .lean();

  // Convert ObjectIds to strings to send to the client
  const serialized = sheikhs.map((s) => ({
    ...s,
    _id: s._id.toString(),
    mosqueId: s.mosqueId.toString(),
    groupId: s.groupId
      ? {
          _id: (s.groupId as any)._id?.toString() ?? s.groupId.toString(),
          name: (s.groupId as any).name ?? "",
          activity: (s.groupId as any).activity ?? "",
        }
      : undefined,
    createdAt: s.createdAt.toISOString(),
  }));

  return <SheikhsClient initialData={{ sheikhs: serialized as any }} />;
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";
// import Link from "next/link";
// import { auth } from "@/lib/auth/options";
// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import Group from "@/models/Group";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { UserPlus, Phone } from "lucide-react";
// // import { useSheikhs } from "@/hooks/queries/useSheikhs";
// // import { useGroups } from "@/hooks/queries/useGroups";

// export const metadata = { title: "المشايخ" };

// const ACT: Record<string, string> = {
//   quran: "قرآن",
//   tarbiya: "تربية",
//   tajweed: "تجويد",
//   maqraa: "مقرأة",
//   playground: "ملعب",
// };

// export default async function SheikhsPage() {
//   const session = await auth();
//   const mosqueId = session?.user.mosqueId;
//   if (!mosqueId) return null;

//   await connectDB();

//   // example of using hooks in a client component, instead of fetching data directly in the server component
//   // const x = useSheikhs();
//   // console.log("🚀 ~ SheikhsPage ~ x:", x);
//   // const y = useGroups();
//   // console.log("🚀 ~ SheikhsPage ~ y:", y);

//   const sheikhs = await Sheikh.find({ mosqueId }).sort({ name: 1 }).lean();

//   const groups = await Group.find({ mosqueId })
//     .populate("sheikhId", "name")
//     .select("name activity sheikhId studentIds")
//     .lean();

//   // Map sheikh groups
//   const groupsBySheikhId: Record<string, typeof groups> = {};
//   for (const g of groups) {
//     const id = (g.sheikhId as any)?._id?.toString() ?? g.sheikhId?.toString();
//     if (!id) continue;
//     if (!groupsBySheikhId[id]) groupsBySheikhId[id] = [];
//     groupsBySheikhId[id].push(g);
//   }

//   return (

//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">المشايخ</h1>
//           <p className="text-muted-foreground text-sm">
//             {sheikhs.length} شيخ مسجل
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/sheikhs/new">
//             <UserPlus size={16} className="ml-2" /> إضافة شيخ
//           </Link>
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {sheikhs.length === 0 && (
//           <p className="text-muted-foreground col-span-full text-center py-12">
//             لا يوجد مشايخ مسجلون
//           </p>
//         )}
//         {sheikhs.map((s) => {
//           const shGrps = groupsBySheikhId[s._id.toString()] ?? [];
//           return (
//             <Card
//               key={s._id.toString()}
//               className="hover:shadow-sm transition-shadow"
//             >
//               <CardContent className="pt-5 space-y-3">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="font-semibold">{s.name}</p>
//                     {s.phone && (
//                       <p
//                         className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"
//                         dir="ltr"
//                       >
//                         <Phone size={12} />
//                         {s.phone}
//                       </p>
//                     )}
//                   </div>
//                   <Button variant="ghost" size="sm" asChild>
//                     <Link href={`/sheikhs/${s._id}`}>تفاصيل</Link>
//                   </Button>
//                   <Button variant="outline" size="sm" asChild>
//                     <Link href={`/sheikhs/${s._id}/edit`}>تعديل</Link>
//                   </Button>
//                 </div>

//                 {shGrps.length > 0 && (
//                   <div className="space-y-1.5">
//                     {shGrps.map((g) => (
//                       <div
//                         key={g._id.toString()}
//                         className="flex items-center justify-between text-sm"
//                       >
//                         <span className="text-muted-foreground">{g.name}</span>
//                         <div className="flex gap-1">
//                           <Badge variant="outline" className="text-xs">
//                             {ACT[g.activity] ?? g.activity}
//                           </Badge>
//                           <Badge variant="secondary" className="text-xs">
//                             {g.studentIds.length} طالب
//                           </Badge>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {shGrps.length === 0 && (
//                   <p className="text-xs text-muted-foreground">
//                     لا توجد مجموعات مرتبطة
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
