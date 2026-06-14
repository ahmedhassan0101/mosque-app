/* eslint-disable @typescript-eslint/no-unused-vars */
// src\app\api\groups\route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/temp/connect";
import Group from "@/models/group.model";
import { getMosqueId } from "@/lib/auth/get-context";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(2),
  activity: z.enum(["quran", "tarbiya", "tajweed", "maqraa", "playground"]),
  sheikhId: z.string().min(1),
  studentIds: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export async function GET(_: NextRequest) {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();
    const groups = await Group.find({ mosqueId })
      .populate("sheikhId", "name phone")
      .populate("studentIds", "name level")
      .sort({ activity: 1, name: 1 })
      .lean();
    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();
    const parsed = groupSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const group = await Group.create({ ...parsed.data, mosqueId });
    return NextResponse.json({ group }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
