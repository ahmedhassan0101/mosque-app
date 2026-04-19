import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/db";
import { Mosque } from "@/models/mosque.model";
import { User } from "@/models/user.model";
import { cache } from "react"; // لتحسين الأداء


export const getMosqueSettingsData = cache(async () => {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  try {
    await connectDB();

    const mosqueId = session.user.mosqueId;

    const [mosque, users] = await Promise.all([
      Mosque.findById(mosqueId).lean(),
      User.find({ mosqueId }).lean(),
    ]);

    if (!mosque) return null;

    // 3. الـ Serialization المركزي
    return {
      mosque: {
        id: mosque._id.toString(),
        name: mosque.name as string,
        address: mosque.address as string,
        phone: mosque.phone as string,
        inviteCode: mosque.inviteCode as string,
      },
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name as string,
        email: u.email as string,
        role: u.role as string,
        image: (u.image as string) ?? null,
      })),
      currentUserId: session.user.id,
    };
  } catch (error) {
    console.error("[Data Fetching Error - getMosqueSettingsData]:", error);
    return null;
  }
});