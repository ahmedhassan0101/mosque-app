import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/temp/connect";
import Student from "@/models/Student";
import { getMosqueId } from "@/lib/auth/get-context";
import QRCode from "qrcode";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    const student = await Student.findOne({ _id: params.id, mosqueId })
      .select("name _id mosqueId")
      .lean();

    if (!student)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = JSON.stringify({
      id: student._id.toString(),
      mosqueId: student.mosqueId.toString(),
      name: student.name,
    });

    const svgString = await QRCode.toString(payload, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#1B6B3A", light: "#FFFFFF" },
    });

    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": `inline; filename="qr-${params.id}.svg"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
