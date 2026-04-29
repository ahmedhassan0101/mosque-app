"use server";

import {
  fail,
  firstZodIssue,
  handleActionError,
  ok,
  type ActionResponse,
} from "@/lib/action-response";

import { revalidatePath } from "next/cache";

import Group from "@/models/group.model";
import { groupSchema, GroupInput } from "@/schemas/group.schema";
import { connectDB } from "@/lib/db/db";
import { getMosqueId } from "@/lib/auth/get-context";

export async function saveGroup(
  data: GroupInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validation
  const parsed = groupSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & DB
    await connectDB();
    const mosqueId = await getMosqueId();
    // 3. Execution
    if (id) {
      // Update

      // ✅ حماية إضافية: حذف الـ activity من البيانات أثناء التعديل
      // حتى لو تم التلاعب بالفورم، نوع المجموعة الأصلي لن يتغير
      const { activity, ...updateData } = parsed.data;

      const updated = await Group.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: updateData }, // 👈 نمرر البيانات بدون activity
        { new: true, runValidators: true },
      );
      //     const { activity, ...updateData } = parsed.data;
      // const updated = await Group.findOneAndUpdate(
      //   { _id: id, mosqueId },
      //   { $set: parsed.data },
      //   { new: true, runValidators: true },
      // );
      if (!updated)
        return fail("المجموعة غير موجودة أو لا تملك صلاحية تعديلها.");
    } else {
      // Create
      await Group.create({ ...parsed.data, mosqueId });
    }
    // 4. Cache Invalidation
    revalidatePath("/dashboard/groups");
    if (id) revalidatePath(`/dashboard/teachers/${id}`);


    // 5. Unified Return
    return ok(undefined, id ? "تم تحديث المجموعة" : "تم إنشاء المجموعة بنجاح");
  } catch (error) {
    // 6. Error Handling
    return handleActionError(error, "saveGroup");
  }
}

export async function deleteGroup(id: string): Promise<ActionResponse> {
  try {
    // 1. Auth & DB
    await connectDB();
    const mosqueId = await getMosqueId();

    // 2. Execution
    const deleted = await Group.findOneAndDelete({ _id: id, mosqueId });
    if (!deleted) return fail("المجموعة غير موجودة أو لا تملك صلاحية حذفها.");

    // 3. Cache Invalidation
    revalidatePath("/dashboard/groups");
    // 4. Unified Return
    return ok(undefined, "تم حذف المجموعة بنجاح.");
  } catch (error) {
    // 5. Error Handling
    return handleActionError(error, "deleteGroup");
  }
}
