/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\(dashboard)\sheikhs\[id]\page.tsx
import { auth } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import Group from "@/models/Group";
import "@/models/Student";
import { notFound } from "next/navigation";
import { SheikhProfileClient } from "@/components/sheikhs/SheikhProfileClient";

type PageProps = { params: Promise<{ id: string }> };

/**
 * generateMetadata: runs on the server
 * fetches the sheikh's name to put in the page title
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const s = await Sheikh.findById(id).select("name").lean();
  return {
    title: s?.name ?? "الشيخ",
    description: `بيانات ومجموعات ${s?.name ?? "الشيخ"}`,
  };
}

export default async function SheikhProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const mosqueId = session?.user.mosqueId;
  if (!mosqueId) return null;

  await connectDB();

  const [sheikh, groups] = await Promise.all([
    Sheikh.findOne({ _id: id, mosqueId }).lean(),
    Group.find({ mosqueId, sheikhId: id })
      .populate("studentIds", "name level photo")
      .lean(),
  ]);

  if (!sheikh) notFound();

  // Serialize
  const data = {
    sheikh: {
      ...sheikh,
      _id: sheikh._id.toString(),
      mosqueId: sheikh.mosqueId.toString(),
      createdAt: sheikh.createdAt.toISOString(),
    },
    groups: groups.map((g) => ({
      _id: g._id.toString(),
      name: g.name,
      activity: g.activity,
      students: (g.studentIds as any[]).map((s: any) => ({
        _id: s._id.toString(),
        name: s.name,
        level: s.level,
        photo: s.photo ?? null,
      })),
    })),
  };

  return <SheikhProfileClient data={data as any} sheikhId={id} />;
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@/lib/auth/options";
// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import Group from "@/models/Group";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Pencil, Phone, Users, User } from "lucide-react";
// import "@/models/Student"; // عشان populate تشتغل بدون مشاكل
// type PageProps = {
//   params: Promise<{ id: string }>;
// };

// export async function generateMetadata({ params }: PageProps) {
//   const { id } = await params;
//   await connectDB();
//   const s = await Sheikh.findById(id).select("name").lean();
//   return { title: s?.name ?? "الشيخ" };
// }

// const ACT_MAP: Record<string, string> = {
//   quran: "القرآن",
//   tarbiya: "التربية",
//   tajweed: "التجويد",
//   maqraa: "المقرأة",
//   playground: "الملعب",
// };

// export default async function SheikhProfilePage({ params }: PageProps) {
//   const { id } = await params;
//   const session = await auth();
//   const mosqueId = session?.user.mosqueId;
//   if (!mosqueId) return null;

//   await connectDB();

//   const [sheikh, groups] = await Promise.all([
//     Sheikh.findOne({ _id: id, mosqueId }).lean(),
//     Group.find({ mosqueId, sheikhId: id })
//       .populate("studentIds", "name level")
//       .lean(),
//   ]);

//   if (!sheikh) notFound();

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center shrink-0">
//             {sheikh.photo ? (
//               <Image
//                 src={sheikh.photo}
//                 alt={sheikh.name}
//                 width={64}
//                 height={64}
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <User size={28} className="text-muted-foreground" />
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">{sheikh.name}</h1>
//             {sheikh.phone && (
//               <p
//                 className="text-sm text-muted-foreground flex items-center gap-1 mt-1"
//                 dir="ltr"
//               >
//                 <Phone size={13} />
//                 {sheikh.phone}
//               </p>
//             )}
//           </div>
//         </div>

//         <Button asChild>
//           <Link href={`/sheikhs/${id}/edit`}>
//             <Pencil size={14} className="ml-2" />
//             تعديل
//           </Link>
//         </Button>
//       </div>

//       {/* المجموعات */}
//       {groups.length > 0 && (
//         <div className="space-y-3">
//           <h2 className="text-base font-semibold">
//             المجموعات ({groups.length})
//           </h2>
//           {groups.map((g) => {
//             const students = g.studentIds as any[];
//             return (
//               <Card key={g._id.toString()}>
//                 <CardHeader className="pb-2">
//                   <div className="flex items-center justify-between">
//                     <CardTitle className="text-sm">{g.name}</CardTitle>
//                     <Badge variant="outline">
//                       {ACT_MAP[g.activity] ?? g.activity}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
//                     <Users size={13} />
//                     <span>{students.length} طالب</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {students.slice(0, 8).map((s: any) => (
//                       <Link
//                         key={s._id.toString()}
//                         href={`/students/${s._id}`}
//                         className="text-xs bg-muted hover:bg-muted/80 rounded-md px-2 py-1 transition-colors"
//                       >
//                         {s.name}
//                       </Link>
//                     ))}
//                     {students.length > 8 && (
//                       <span className="text-xs text-muted-foreground px-2 py-1">
//                         +{students.length - 8} آخرين
//                       </span>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {groups.length === 0 && (
//         <Card>
//           <CardContent className="py-8 text-center text-muted-foreground text-sm">
//             لا توجد مجموعات مرتبطة بهذا الشيخ
//           </CardContent>
//         </Card>
//       )}

//       {/* ملاحظات */}
//       {/* {sheikh.notes && (
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm text-muted-foreground">
//               ملاحظات
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm leading-relaxed">{sheikh.notes}</p>
//           </CardContent>
//         </Card>
//       )} */}
//     </div>
//   );
// }
