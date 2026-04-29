import { cache } from "react";
import { connectDB } from "../db/db";
import Group, { IGroup } from "@/models/group.model";
import { getMosqueId } from "../auth/get-context";
import { Serialize } from "@/types/serialized";
import { serialize } from "../db/serialize";

export type GroupSerialized = Serialize<IGroup>;

export const getGroupById = cache(
  async (id: string): Promise<GroupSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const group = await Group.findOne({ _id: id, mosqueId }).lean();
      return serialize(group);
    } catch (error) {
      console.error("[Data Fetching Error - getGroupById]:", error);
      return null;
    }
  },
);

export const getGroupsList = cache(
  async (type: string): Promise<GroupSerialized[] | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();
      const groups = await Group.find({ mosqueId, activity: type })
        .sort({ createdAt: -1 })
        .lean();
      return groups.map(serialize).filter(Boolean) as GroupSerialized[];
    } catch (error) {
      console.error("[Data Fetching Error - getGroupsList]:", error);
      return null;
    }
  },
);
