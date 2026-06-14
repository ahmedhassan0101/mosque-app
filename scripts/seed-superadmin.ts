// scripts/seed-superadmin.ts
// تشغيل: npx tsx scripts/seed-superadmin.ts

import mongoose from "mongoose";
import dotenv   from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Inline schema to avoid circular imports in scripts
  const UserModel = mongoose.models.User ?? mongoose.model("User",
    new mongoose.Schema({
      mosqueId: { type: mongoose.Schema.Types.ObjectId, default: null },
      name:     String,
      email:    { type: String, unique: true },
      password: String,
      role:     String,
    })
  );

  const bcrypt = await import("bcryptjs");
  const hash   = await bcrypt.hash("SuperAdmin@2025", 12);

  await UserModel.findOneAndUpdate(
    { email: "super@mosque-system.com" },
    {
      mosqueId: null,
      name:     "Super Admin",
      email:    "super@mosque-system.com",
      password: hash,
      role:     "superadmin",
    },
    { upsert: true, new: true }
  );

  console.log("✅ Superadmin created: super@mosque-system.com / SuperAdmin@2025");
  await mongoose.disconnect();
}

seed().catch(console.error);