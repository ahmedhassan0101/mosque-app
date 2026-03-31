import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Mosque from "@/models/Mosque";
import User from "@/models/User";
import { z } from "zod";

const schema = z.object({
  mosqueName: z.string().min(3),
  adminName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    /* Check duplicate email */
    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 },
      );
    }
    /* Atomic-ish: create mosque → create admin */
    const mosque = await Mosque.create({
      name: parsed.data.mosqueName,
      phone: parsed.data.phone,
      address: parsed.data.address,
    });
    await User.create({
      mosqueId: mosque._id,
      name: parsed.data.adminName,
      email: parsed.data.email,
      password: parsed.data.password, // hashed by pre-save hook in User model
      role: "admin",
    });
    

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", mosqueId: mosque._id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/register]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
