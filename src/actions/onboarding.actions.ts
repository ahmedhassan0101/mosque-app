"use server";

/**
 * @file onboarding.actions.ts
 * @description Actions for the onboarding flow: creating or joining a mosque.
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

import {
  createMosqueSchema,
  joinMosqueSchema,
  type CreateMosqueInput,
  type JoinMosqueInput,
} from "@/schemas/onboarding.schema";

/**
 * Creates a new Mosque and assigns the current user as ADMIN.
 */
export async function createMosque(
  data: CreateMosqueInput,
): Promise<ActionResponse<{ mosqueId: string }>> {
  // 1. Session Guard
  const session = await auth();
  if (!session?.user) return fail("يجب عليك تسجيل الدخول أولاً.");
  if (session.user.mosqueId) return fail("أنت مرتبط بمسجد بالفعل.");

  // 2. Validation
  const parsed = createMosqueSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await connectDB();

    // 3. Logic
    const mosque = await Mosque.create(parsed.data);

    await User.findByIdAndUpdate(session.user.id, {
      mosqueId: mosque._id,
      role: "ADMIN",
    });

    return ok(
      { mosqueId: mosque._id.toString() },
      "مبارك! تم إنشاء المسجد بنجاح وأنت الآن المسؤول عنه.",
    );
  } catch (error) {
    return handleActionError(error, "createMosque");
  }
}

/**
 * Joins an existing Mosque using a unique invite code.
 */
export async function joinMosque(
  data: JoinMosqueInput,
): Promise<ActionResponse<{ mosqueId: string }>> {
  // 1. Session Guard
  const session = await auth();
  if (!session?.user) return fail("يجب عليك تسجيل الدخول أولاً.");
  if (session.user.mosqueId) return fail("أنت مرتبط بمسجد بالفعل.");

  // 2. Validation
  const parsed = joinMosqueSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    await connectDB();

    // 3. Logic
    const mosque = await Mosque.findOne({
      inviteCode: parsed.data.inviteCode.toUpperCase(),
    });

    if (!mosque) {
      return fail("رمز الدعوة غير صحيح أو ربما تم تغييره.");
    }

    await User.findByIdAndUpdate(session.user.id, {
      mosqueId: mosque._id,
      role: "SUPERVISOR",
    });

    return ok(
      { mosqueId: mosque._id.toString() },
      `تم انضمامك بنجاح إلى "${mosque.name}" كـ مشرف.`,
    );
  } catch (error) {
    return handleActionError(error, "joinMosque");
  }
}
