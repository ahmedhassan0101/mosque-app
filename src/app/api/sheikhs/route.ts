/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import { requireMosque } from "@/lib/auth/get-context";
import { z } from "zod";

const sheikhSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  groupId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(_: NextRequest) {
  try {
    const mosqueId = await requireMosque(); 
    await connectDB();
    const sheikhs = await Sheikh.find({ mosqueId })
      .populate("groupId", "name activity")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ sheikhs });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log(123);

    const mosqueId = await requireMosque();
    console.log(456);
    const body = await req.json();
    const parsed = sheikhSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const sheikh = await Sheikh.create({ ...parsed.data, mosqueId });
    return NextResponse.json({ sheikh }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
