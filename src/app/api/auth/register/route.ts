// src\app\api\auth\register\route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
// import Mosque from "@/models/Mosque";
import User from "@/models/User";
import { z } from "zod";
import { apiError } from "@/lib/errors";

// const schema = z.object({
//   mosqueName: z.string().min(3),
//   adminName: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(8),
//   phone: z.string().optional(),
//   address: z.string().optional(),
// });

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});

/**
 * POST /api/auth/register
 * Creates a user account only — mosque setup happens at /onboarding
 */
export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    // const parsed = schema.safeParse(body);
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    await connectDB();

    /* Check duplicate email */
    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) return apiError("البريد الإلكتروني مستخدم بالفعل", 409);

    /* Atomic-ish: create mosque → create admin */
    // const mosque = await Mosque.create({
    //   name: parsed.data.mosqueName,
    //   phone: parsed.data.phone,
    //   address: parsed.data.address,
    // });
    await User.create({
      // mosqueId: mosque._id,
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password, // hashed by pre-save hook in User model
      provider: "credentials",
      role: "admin",
      mosqueId: null, // will be set after onboarding
    });

    return NextResponse.json({ message: "تم إنشاء الحساب" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/register]", err);
    return apiError("خطأ في الخادم", 500);
  }
}
