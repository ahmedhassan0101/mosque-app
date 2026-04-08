import { cache } from "react";
import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import Group from "@/models/Group";
import { getMosqueId } from "@/lib/auth/get-context";

export async function getSheikhsList() {
  const mosqueId = await getMosqueId();
  await connectDB();

  return Sheikh.find({ mosqueId }).sort({ name: 1 }).lean();
}

export async function getGroupsList() {
  const mosqueId = await getMosqueId();
  await connectDB();
  return Group.find({ mosqueId }).sort({ name: 1 }).lean();
}

export const getSheikhById = cache(async (id: string) => {
  const mosqueId = await getMosqueId();
  await connectDB();

  return Sheikh.findOne({ _id: id, mosqueId }).lean();
});

export async function getGroupsBySheikh(sheikhId: string) {
  const mosqueId = await getMosqueId();
  await connectDB();

  return Group.find({ mosqueId, sheikhId })
    .populate("studentIds", "name level photo")
    .lean();
}
