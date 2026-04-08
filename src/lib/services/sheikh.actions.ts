"use server";

import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import { getMosqueId } from "../auth/get-context";
import { sheikhSchema } from "@/lib/validations/sheikh";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

type SheikhInput = z.infer<typeof sheikhSchema>;

export async function saveSheikhAction(data: SheikhInput, id?: string) {
  try {
    const mosqueId = await getMosqueId();
    const parsed = sheikhSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "بيانات غير صالحة" };
    }

    await connectDB();

    if (id) {
      await Sheikh.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: parsed.data },
        { new: true, runValidators: true },
      );
    } else {
      await Sheikh.create({ ...parsed.data, mosqueId });
    }

    revalidatePath("/sheikhs");
  } catch (error) {
    console.error(error);
    return { error: "حدث خطأ في السيرفر" };
  }

  redirect("/sheikhs");
}

export async function deleteSheikhAction(id: string) {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();
    const sheikh = await Sheikh.findOneAndDelete({ _id: id, mosqueId });
    if (!sheikh) {
      return { error: "الشيخ غير موجود" };
    }

    revalidatePath("/sheikhs");
  } catch (error) {
    console.error(error);
    return { error: "تعذّر حذف الشيخ" };
  }
}
