// src\app\api\sheikhs\[id]\route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import { getMosqueId } from "@/lib/auth/get-context";
import { sheikhSchema } from "@/lib/validations/sheikh";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/sheikhs/[id]
 * Fetch a sheikh by id — with verification that it belongs to the same mosque
 */
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const mosqueId = await getMosqueId();
    await connectDB();

    const sheikh = await Sheikh.findOne({ _id: id, mosqueId }) // mosqueId guard = multi-tenant safety
      .lean();

    if (!sheikh)
      return NextResponse.json({ error: "Sheikh not found" }, { status: 404 });

    return NextResponse.json({ sheikh });
  } catch (e) {
    return handleError(e);
  }
}

/**
 * PUT /api/sheikhs/[id]
 * Update sheikh data — partial update (all fields optional)
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const mosqueId = await getMosqueId();
    const body = await req.json();

    const parsed = sheikhSchema.partial().safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const sheikh = await Sheikh.findOneAndUpdate(
      { _id: id, mosqueId },
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).lean();

    if (!sheikh)
      return NextResponse.json({ error: "الشيخ غير موجود" }, { status: 404 });

    return NextResponse.json({ sheikh });
  } catch (e) {
    return handleError(e);
  }
}

/**
 * DELETE /api/sheikhs/[id]
 * Delete a sheikh — with mosqueId verification
 */
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const mosqueId = await getMosqueId();
    await connectDB();

    const sheikh = await Sheikh.findOneAndDelete({ _id: id, mosqueId });
    if (!sheikh)
      return NextResponse.json({ error: "الشيخ غير موجود" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}

function handleError(e: unknown): NextResponse {
  if (e instanceof Error) {
    if (e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.error("[/api/sheikhs/[id]]", e);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
