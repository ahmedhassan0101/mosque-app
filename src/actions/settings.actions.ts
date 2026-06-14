"use server";

/**
 * @file settings.actions.ts
 * @description Administrative actions for mosque settings, member management, and invite codes.
 */

import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/client";
import {
  ok,
  fail,
  firstZodIssue,
  handleActionError,
} from "@/lib/utils/action-response";
import type { ActionResponse } from "@/lib/utils/action-response";

import { Mosque } from "@/models/mosque.model";
import { User } from "@/models/user.model";
import { nanoid } from "nanoid";

import {
  updateMosqueSchema,
  updateUserRoleSchema,
  type UpdateMosqueInput,
} from "@/schemas/settings.schema";
import { RolesType } from "@/constants";

// ─── Shared Authorization Helper ─────────────────────────────────────────────

/** Checks if the user is an ADMIN of the specific mosque */
async function validateAdminAccess(mosqueId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHENTICATED");
  if (session.user.role !== "ADMIN" || session.user.mosqueId !== mosqueId) {
    throw new Error("FORBIDDEN");
  }
  return session.user;
}

// ─── Mosque Settings ─────────────────────────────────────────────────────────

export async function updateMosqueSettings(
  mosqueId: string,
  data: UpdateMosqueInput,
): Promise<ActionResponse> {
  const parsed = updateMosqueSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await validateAdminAccess(mosqueId);
    await connectDB();

    await Mosque.findByIdAndUpdate(mosqueId, parsed.data);
    return ok(undefined, "تم تحديث بيانات المسجد بنجاح.");
  } catch (error) {
    return handleActionError(error, "updateMosqueSettings");
  }
}

export async function refreshInviteCode(
  mosqueId: string,
): Promise<ActionResponse<{ inviteCode: string }>> {
  try {
    await validateAdminAccess(mosqueId);
    await connectDB();

    const newCode = nanoid(8).toUpperCase();
    await Mosque.findByIdAndUpdate(mosqueId, { inviteCode: newCode });

    return ok({ inviteCode: newCode }, "تم توليد رمز دعوة جديد بنجاح.");
  } catch (error) {
    return handleActionError(error, "refreshInviteCode");
  }
}

// ─── User Management ─────────────────────────────────────────────────────────

export async function updateUserRole(
  mosqueId: string,
  userId: string,
  newRole: RolesType,
): Promise<ActionResponse> {
  const parsed = updateUserRoleSchema.safeParse({ userId, newRole });
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    const admin = await validateAdminAccess(mosqueId);
    if (admin.id === userId) return fail("لا يمكنك تغيير صلاحياتك بنفسك.");

    await connectDB();
    const result = await User.findOneAndUpdate(
      { _id: userId, mosqueId },
      { role: newRole },
    );

    if (!result) return fail("المستخدم غير موجود ضمن نطاق هذا المسجد.");

    return ok(undefined, "تم تحديث صلاحيات المستخدم بنجاح.");
  } catch (error) {
    return handleActionError(error, "updateUserRole");
  }
}

export async function removeUserFromMosque(
  mosqueId: string,
  userId: string,
): Promise<ActionResponse> {
  try {
    const admin = await validateAdminAccess(mosqueId);
    if (admin.id === userId)
      return fail("لا يمكنك إزالة نفسك من إدارة المسجد.");

    await connectDB();
    const result = await User.findOneAndUpdate(
      { _id: userId, mosqueId },
      { mosqueId: null, role: "SUPERVISOR" }, // Reset to default
    );

    if (!result) return fail("لم يتم العثور على المستخدم.");

    return ok(undefined, "تم إزالة المستخدم من المسجد بنجاح.");
  } catch (error) {
    return handleActionError(error, "removeUserFromMosque");
  }
}
