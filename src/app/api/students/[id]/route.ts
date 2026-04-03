import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Student from "@/models/Student";
import { requireMosque } from "@/lib/auth/get-context";
import { studentSchema } from "@/lib/validations/student";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const mosqueId  = await requireMosque();
    await connectDB();
    const student = await Student.findOne({ _id: params.id, mosqueId }).lean();
    if (!student)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ student });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const mosqueId = await requireMosque();
    const body = await req.json();
    const parsed = studentSchema.partial().safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );

    await connectDB();
    const student = await Student.findOneAndUpdate(
      { _id: params.id, mosqueId },
      { $set: parsed.data },
      { new: true },
    ).lean();

    if (!student)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ student });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const mosqueId = await requireMosque();
    await connectDB();
    // Soft delete
    await Student.findOneAndUpdate(
      { _id: params.id, mosqueId },
      { isActive: false },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
