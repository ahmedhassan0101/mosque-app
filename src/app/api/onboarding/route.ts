// src\app\api\onboarding\route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import Mosque from "@/models/Mosque";
import User from "@/models/User";
import { z } from "zod";
import { apiError } from "@/lib/errors";

const schema = z.object({
  mosqueName: z.string().min(3, "اسم المسجد 3 أحرف على الأقل"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * POST /api/onboarding
 * Called after first login (credentials or Google).
 * Creates mosque + updates user.mosqueId.
 *
 * After success, client must call update() on the session
 * so the JWT reflects the new mosqueId.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    console.log("🚀 ~ POST ~ session:", session);

    if (!session?.user?.id) return apiError("غير مصرح", 401);
    if (session.user.mosqueId) return apiError("المسجد مسجل بالفعل", 409); // من السطر دا

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: session.user.email,
    }).select("mosqueId _id");

    if (!existingUser) return apiError("المستخدم غير موجود", 404);
    if (existingUser.mosqueId) return apiError("المسجد مسجل بالفعل", 409);

    const mosque = await Mosque.create({
      name: parsed.data.mosqueName,
      address: parsed.data.address,
      phone: parsed.data.phone,
    });

    // await User.findByIdAndUpdate(session.user.id, {
    //   mosqueId: mosque._id,
    // });
    await User.findByIdAndUpdate(existingUser._id, {
      mosqueId: mosque._id,
    });

    return NextResponse.json({
      message: "تم إنشاء المسجد بنجاح",
      mosqueId: mosque._id.toString(),
    });
  } catch (err) {
    console.error("[POST /api/onboarding]", err);
    return apiError("خطأ في الخادم", 500);
  }
}
