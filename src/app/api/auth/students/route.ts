import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/db/connect";
import Student from "@/models/Student";
import { studentSchema } from "@/lib/validations/student";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const mosqueId = headersList.get("x-mosque-id");
    if (!mosqueId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const activity = searchParams.get("activity");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = { mosqueId, isActive: true };
    if (activity) query.enrollments = activity;
    if (search) query.name = { $regex: search, $options: "i" };

    const students = await Student.find(query)
      .select("-__v")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ students });
  } catch (error) {
    console.error("GET /api/students:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const mosqueId = headersList.get("x-mosque-id");
    if (!mosqueId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = studentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const student = await Student.create({ ...parsed.data, mosqueId });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error("POST /api/students:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
