// src/lib/data/session.data.ts
import { cache } from "react";
import { connectDB } from "@/lib/db/client";
import { getMosqueId } from "@/lib/auth/get-context";
import Session from "@/models/session.model";
import { serialize, serializeMany } from "@/lib/utils/serialize";
import type { Serialize } from "@/types/serialized";
import { ISession } from "@/types";

export type SessionSerialized = Serialize<ISession>;

/**
 * Fetches a single session by ID for the edit page.
 */
export const getSessionById = cache(
  async (id: string): Promise<SessionSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const session = await Session.findOne({ _id: id, mosqueId }).lean();
      if (!session) return null;

      return serialize(session) as SessionSerialized;
    } catch (error) {
      console.error("[getSessionById]:", error);
      return null;
    }
  },
);
export const getSessionsList = cache(async () => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const sessions = await Session.find({ mosqueId })
      .populate("groupId", "name")
      .populate("teacherId", "name")
      .populate("attendedStudentIds", "name")
      .lean();

    if (!sessions) return null;
    console.log("🚀 ~ session:", sessions);

    return serializeMany(sessions);
  } catch (error) {
    console.error("[getSessionById]:", error);
    return null;
  }
});
