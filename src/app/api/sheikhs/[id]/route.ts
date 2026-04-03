import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import { requireMosque } from "@/lib/auth/get-context";
import { z } from "zod";

type Params = { params: { id: string } };

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  groupId: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const mosqueId = requireMosque();
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const sheikh = await Sheikh.findOneAndUpdate(
      { _id: params.id, mosqueId },
      { $set: parsed.data },
      { new: true },
    ).lean();

    if (!sheikh)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ sheikh });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const mosqueId = requireMosque();
    await connectDB();
    await Sheikh.findOneAndDelete({ _id: params.id, mosqueId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
