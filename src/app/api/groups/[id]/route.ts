import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Group from "@/models/Group";
import { requireMosque } from "@/lib/auth/get-context";
import { z } from "zod";

type Params = { params: { id: string } };

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  sheikhId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const mosqueId = await requireMosque();
    await connectDB();
    const group = await Group.findOne({ _id: params.id, mosqueId })
      .populate("sheikhId", "name phone")
      .populate("studentIds", "name level currentSurah")
      .lean();
    if (!group)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const mosqueId = await requireMosque();
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const group = await Group.findOneAndUpdate(
      { _id: params.id, mosqueId },
      { $set: parsed.data },
      { new: true },
    ).lean();
    if (!group)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const mosqueId = await requireMosque();
    await connectDB();
    await Group.findOneAndDelete({ _id: params.id, mosqueId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
