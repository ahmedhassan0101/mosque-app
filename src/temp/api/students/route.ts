/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/temp/connect";
import Student from "@/models/Student";
import { studentSchema } from "@/lib/validations/student";
import { getMosqueId } from "@/lib/auth/get-context";
// import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // const headersList = await headers();
    // const mosqueId = headersList.get("x-mosque-id");
    // if (!mosqueId)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const mosqueId = await getMosqueId();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const activity = searchParams.get("activity");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 50);

    const query: Record<string, unknown> = { mosqueId, isActive: true };
    if (activity) query.enrollments = activity;
    if (search) query.name = { $regex: search, $options: "i" };

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-__v")
        .lean(),
      Student.countDocuments(query),
    ]);

    return NextResponse.json({ students, total, page, limit });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();
    const body = await req.json();
    const parsed = studentSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Error creating student:", parsed.error);
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const student = await Student.create({ ...parsed.data, mosqueId });

    return NextResponse.json({ student }, { status: 201 });
  } catch (e: any) {
    console.error("Error creating student:", e);
    if (e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
