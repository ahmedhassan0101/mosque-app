// src\app\api\sheikhs\route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/temp/connect";
import Sheikh from "@/models/Sheikh";
import { getMosqueId } from "@/lib/auth/get-context";
import { sheikhSchema } from "@/lib/validations/sheikh";

/**
 * GET /api/sheikhs
 * Fetch all sheikhs for the current mosque
 * Protected by mosqueId from the middleware
 */
export async function GET() {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    const sheikhs = await Sheikh.find({ mosqueId })
      .populate("groupId", "name activity")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ sheikhs });
  } catch (e) {
    return handleError(e);
  }
}

/**
 * POST /api/sheikhs
 * Create a new sheikh — mosqueId attached automatically
 */
export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();
    const body = await req.json();

    const parsed = sheikhSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const sheikh = await Sheikh.create({ ...parsed.data, mosqueId });
    return NextResponse.json({ sheikh }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}

function handleError(e: unknown): NextResponse {
  if (e instanceof Error) {
    if (e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.error("[/api/sheikhs]", e);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
