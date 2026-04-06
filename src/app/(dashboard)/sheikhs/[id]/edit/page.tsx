// src\app\(dashboard)\sheikhs\[id]\edit\page.tsx
import { auth }      from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import Sheikh        from "@/models/Sheikh";
import { notFound }  from "next/navigation";
import { SheikhForm } from "@/components/sheikhs/SheikhForm";

type PageProps = { params: Promise<{ id: string }> };

export const metadata = { title: "تعديل بيانات الشيخ" };

export default async function EditSheikhPage({ params }: PageProps) {
  const { id }   = await params;
  const session  = await auth();
  const mosqueId = session?.user.mosqueId;
  if (!mosqueId) return null;

  await connectDB();
  const sheikh = await Sheikh.findOne({ _id: id, mosqueId }).lean();
  if (!sheikh) notFound();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تعديل بيانات الشيخ</h1>
        <p className="text-muted-foreground text-sm">{sheikh.name}</p>
      </div>
      <SheikhForm
        sheikhId={id}
        defaultValues={{
          name:  sheikh.name,
          phone: sheikh.phone ?? "",
          photo: sheikh.photo ?? "",
          notes: sheikh.notes ?? "",
        }}
      />
    </div>
  );
}


// import { SheikhForm } from "@/components/sheikhs/SheikhForm";
// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import { notFound } from "next/navigation";

// export const metadata = { title: "تعديل بيانات الشيخ" };

// export default async function EditSheikhPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   console.log("🚀 ~ EditSheikhPage ~ params:", params);
//   await connectDB();

//   const sheikh = await Sheikh.findById(params.id).lean();

//   if (!sheikh) {
//     notFound();
//   }

//   const serializedSheikh = {
//     ...sheikh,
//     _id: sheikh._id.toString(),
//     // لو عندك تواريخ (Date) زي ما عملنا في الطالب، حولها لنص هنا برضه
//   };
//   console.log("🚀 ~ EditSheikhPage ~ serializedSheikh:", serializedSheikh);
//   console.log("🚀 ~ EditSheikhPage ~ sheikh:", sheikh);

//   return (
//     <div className="max-w-lg mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">تعديل بيانات الشيخ</h1>
//         <p className="text-muted-foreground text-sm">
//           تحديث بيانات الشيخ: {sheikh.name}
//         </p>
//       </div>

//       {/* <SheikhForm defaultValues={sheikh} sheikhId={serializedSheikh._id} /> */}
//     </div>
//   );
// }

// import { auth } from "@/lib/auth/options";
// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import { notFound } from "next/navigation";
// import { SheikhForm } from "@/components/sheikhs/SheikhForm";

// export const metadata = { title: "تعديل بيانات الشيخ" };


// type PageProps = {
//   params: Promise<{ id: string }>;
// };
// export default async function EditSheikhPage({
//   params,
// }: PageProps) {
//   const { id } = await params;
//   const session = await auth();
//   const mosqueId = session?.user.mosqueId;
//   if (!mosqueId) return null;

//   await connectDB();
//   const sheikh = await Sheikh.findOne({ _id: id, mosqueId }).lean();
//   if (!sheikh) notFound();

//   return (
//     <div className="max-w-lg mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">تعديل بيانات الشيخ</h1>
//         <p className="text-muted-foreground text-sm">{sheikh.name}</p>
//       </div>
//       <SheikhForm
//         sheikhId={id}
//         defaultValues={{
//           name: sheikh.name,
//           phone: sheikh.phone ?? "",
//           photo: sheikh.photo ?? "",
//           // notes: sheikh.notes ?? "",
//         }}
//       />
//     </div>
//   );
// }
