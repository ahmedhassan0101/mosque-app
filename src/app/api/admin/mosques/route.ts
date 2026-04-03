/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Mosque from "@/models/Mosque";
import Student from "@/models/Student";
import Sheikh from "@/models/Sheikh";
import Session from "@/models/Session";
import { requireSuperAdmin } from "@/lib/auth/get-context";

export async function GET() {
  try {
    await requireSuperAdmin();
    await connectDB();

    const mosques = await Mosque.find().sort({ createdAt: -1 }).lean();

    // Aggregate stats per mosque in one go
    const mosqueIds = mosques.map((m) => m._id);

    const [studentCounts, sheikhCounts, sessionCounts] = await Promise.all([
      Student.aggregate([
        { $match: { mosqueId: { $in: mosqueIds }, isActive: true } },
        { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
      ]),
      Sheikh.aggregate([
        { $match: { mosqueId: { $in: mosqueIds } } },
        { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
      ]),
      Session.aggregate([
        { $match: { mosqueId: { $in: mosqueIds } } },
        { $group: { _id: "$mosqueId", count: { $sum: 1 } } },
      ]),
    ]);

    // Map counts by mosqueId string
    const toMap = (arr: any[]) =>
      Object.fromEntries(arr.map((x) => [x._id.toString(), x.count]));

    const sc = toMap(studentCounts);
    const shc = toMap(sheikhCounts);
    const sec = toMap(sessionCounts);

    const data = mosques.map((m) => ({
      ...m,
      stats: {
        students: sc[m._id.toString()] ?? 0,
        sheikhs: shc[m._id.toString()] ?? 0,
        sessions: sec[m._id.toString()] ?? 0,
      },
    }));

    return NextResponse.json({ mosques: data });
  } catch (e: any) {
    if (e.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
