// "use server";

// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import { getMosqueId } from "../auth/get-context";
// import { sheikhSchema } from "@/lib/validations/sheikh";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { z } from "zod";

// type SheikhInput = z.infer<typeof sheikhSchema>;

// export async function saveSheikhAction(data: SheikhInput, id?: string) {
//   try {
//     const mosqueId = await getMosqueId();
//     const parsed = sheikhSchema.safeParse(data);

//     if (!parsed.success) {
//       return { error: "بيانات غير صالحة" };
//     }

//     await connectDB();

//     if (id) {
//       await Sheikh.findOneAndUpdate(
//         { _id: id, mosqueId },
//         { $set: parsed.data },
//         { new: true, runValidators: true },
//       );
//     } else {
//       await Sheikh.create({ ...parsed.data, mosqueId });
//     }

//     revalidatePath("/sheikhs");
//   } catch (error) {
//     console.error(error);
//     return { error: "حدث خطأ في السيرفر" };
//   }

//   redirect("/sheikhs");
// }

// export async function deleteSheikhAction(id: string) {
//   try {
//     const mosqueId = await getMosqueId();
//     await connectDB();
//     const sheikh = await Sheikh.findOneAndDelete({ _id: id, mosqueId });
//     if (!sheikh) {
//       return { error: "الشيخ غير موجود" };
//     }

//     revalidatePath("/sheikhs");
//   } catch (error) {
//     console.error(error);
//     return { error: "تعذّر حذف الشيخ" };
//   }
// }
"use server";

import { connectDB }      from "@/lib/db/connect";
import Sheikh             from "@/models/Sheikh";
import { getMosqueId }    from "@/lib/auth/get-context";
import { sheikhSchema }   from "@/lib/validations/sheikh";
import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import type { z }         from "zod";

type SheikhInput  = z.infer<typeof sheikhSchema>;
type ActionResult = { error: string } | undefined;

/**
 * saveSheikhAction
 * Creates or updates a sheikh.
 *
 * WHY redirect() is OUTSIDE try/catch:
 * redirect() internally throws a special Next.js error (NEXT_REDIRECT).
 * If placed inside catch{}, that throw gets caught and redirect never fires.
 * Correct pattern: do all DB work inside try/catch, then redirect after.
 */
export async function saveSheikhAction(
  data: SheikhInput,
  id?: string
): Promise<ActionResult> {
  // Validate before touching the DB
  const parsed = sheikhSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "بيانات غير صالحة" };
  }

  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    if (id) {
      // Update — mosqueId scoping prevents cross-tenant writes
      const updated = await Sheikh.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: parsed.data },
        { new: true, runValidators: true }
      );
      if (!updated) return { error: "الشيخ غير موجود" };
    } else {
      await Sheikh.create({ ...parsed.data, mosqueId });
    }

    revalidatePath("/sheikhs");
  } catch (error) {
    console.error("[saveSheikhAction]", error);
    return { error: "حدث خطأ في الخادم، حاول مرة أخرى" };
  }

  // Outside try/catch — intentional, see comment above
  redirect("/sheikhs");
}

/**
 * deleteSheikhAction
 * Deletes a sheikh scoped to the current mosque.
 * Returns undefined on success, error object on failure.
 * No redirect — caller handles navigation.
 */
export async function deleteSheikhAction(id: string): Promise<ActionResult> {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    const deleted = await Sheikh.findOneAndDelete({ _id: id, mosqueId });
    if (!deleted) return { error: "الشيخ غير موجود" };

    revalidatePath("/sheikhs");
  } catch (error) {
    console.error("[deleteSheikhAction]", error);
    return { error: "تعذّر حذف الشيخ" };
  }
}