// src\app\(dashboard)\sheikhs\[id]\edit\page.tsx
import { notFound } from "next/navigation";
import { SheikhForm } from "@/components/sheikhs/SheikhForm";
import { getSheikhById } from "@/lib/services/sheikh.service";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "تعديل بيانات الشيخ" };

export default async function EditSheikhPage({ params }: Props) {
  const { id } = await params;
  const sheikh = await getSheikhById(id);
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
          name: sheikh.name,
          phone: sheikh.phone ?? "",
          photo: sheikh.photo ?? "",
          notes: sheikh.notes ?? "",
        }}
      />
    </div>
  );
}
