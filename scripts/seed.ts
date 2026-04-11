/**
 * Mosque Seeder
 * Generates realistic Arabic test data for students, sheikhs, and groups.
 *
 * Usage:
 *   npx tsx scripts/seed.ts              # seed with defaults
 *   npx tsx scripts/seed.ts --clean      # drop existing data first
 *   npx tsx scripts/seed.ts --sheikhs=5 --students=50
 *
 * Idempotent: checks if data exists before inserting.
 * Uses bulkWrite for performance.
 */

import mongoose from "mongoose";
import { faker } from "@faker-js/faker/locale/ar";
import { faker as fakerEn } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ── Inline schemas (avoid importing Next.js models in scripts) ────────────
const StudentSchema = new mongoose.Schema(
  {
    mosqueId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    birthDate: Date,
    phone: String,
    guardianName: String,
    guardianPhone: { type: String, required: true },
    address: String,
    photo: String,
    gender: { type: String, enum: ["male", "female"] },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    groupId: mongoose.Schema.Types.ObjectId,
    enrollments: [String],
    trackIbadah: { type: Boolean, default: false },
    currentSurah: String,
    currentAyah: Number,
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const SheikhSchema = new mongoose.Schema(
  {
    mosqueId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: String,
    photo: String,
    notes: String,
  },
  { timestamps: true },
);

const GroupSchema = new mongoose.Schema(
  {
    mosqueId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    activity: {
      type: String,
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
    },
    sheikhId: mongoose.Schema.Types.ObjectId,
    studentIds: [mongoose.Schema.Types.ObjectId],
    notes: String,
  },
  { timestamps: true },
);

const StudentModel =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);
const SheikhModel =
  mongoose.models.Sheikh || mongoose.model("Sheikh", SheikhSchema);
const GroupModel =
  mongoose.models.Group || mongoose.model("Group", GroupSchema);

// ── Arabic data pools ────────────────────────────────────────────────────
const MALE_NAMES = [
  "أحمد محمد",
  "عمر خالد",
  "عبدالله يوسف",
  "محمد إبراهيم",
  "يوسف عبدالرحمن",
  "إبراهيم حسن",
  "علي أحمد",
  "حسن محمود",
  "عبدالرحمن سعيد",
  "زياد طارق",
  "سلمان فهد",
  "ماجد عبدالله",
  "فيصل محمد",
  "تركي عبدالعزيز",
  "بدر خالد",
  "سعد عمر",
  "نواف سلطان",
  "عبدالعزيز ناصر",
  "راشد حمد",
  "منصور صالح",
];

const FEMALE_NAMES = [
  "فاطمة أحمد",
  "عائشة محمد",
  "مريم عبدالله",
  "زينب علي",
  "نور خالد",
  "سارة إبراهيم",
  "هند محمد",
  "لين عمر",
  "رهف سعيد",
  "دانا يوسف",
];

const SHEIKH_NAMES = [
  "الشيخ أحمد الغامدي",
  "الشيخ محمد العتيبي",
  "الشيخ عبدالله الشمري",
  "الشيخ يوسف الزهراني",
  "الشيخ إبراهيم القحطاني",
  "الشيخ عمر الدوسري",
  "الشيخ خالد المطيري",
  "الشيخ علي العنزي",
];

const SURAHS = [
  "الفاتحة",
  "البقرة",
  "آل عمران",
  "النساء",
  "المائدة",
  "الأنعام",
  "الأعراف",
  "الكهف",
  "يس",
  "الملك",
];

const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;
const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const GENDERS = ["male", "female"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────
function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  return `01${fakerEn.number.int({ min: 0, max: 2 })}${fakerEn.string.numeric(8)}`;
}

function randomEnrollments(): string[] {
  const base: string[] = ["quran", "tarbiya"];
  const optional = ["tajweed", "maqraa", "playground"];
  const extras = optional.filter(() => Math.random() > 0.6);
  return [...base, ...extras];
}

// ── Seeder ────────────────────────────────────────────────────────────────
async function seed() {
  const args = process.argv.slice(2);
  const clean = args.includes("--clean");
  const sheikhCount = Number(
    args.find((a) => a.startsWith("--sheikhs="))?.split("=")[1] ?? 6,
  );
  const studentCount = Number(
    args.find((a) => a.startsWith("--students="))?.split("=")[1] ?? 40,
  );

  const MOSQUE_ID = new mongoose.Types.ObjectId(
    process.env.SEED_MOSQUE_ID ?? "000000000000000000000001",
  );

  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  // ── Optional clean ───────────────────────────────────────────────────
  if (clean) {
    await Promise.all([
      StudentModel.deleteMany({ mosqueId: MOSQUE_ID }),
      SheikhModel.deleteMany({ mosqueId: MOSQUE_ID }),
      GroupModel.deleteMany({ mosqueId: MOSQUE_ID }),
    ]);
    console.log("🗑️  Cleared existing data");
  }

  // ── Check idempotency ────────────────────────────────────────────────
  const existing = await SheikhModel.countDocuments({ mosqueId: MOSQUE_ID });
  if (existing > 0 && !clean) {
    console.log(
      `⚠️  Data already exists (${existing} sheikhs). Use --clean to reset.`,
    );
    await mongoose.disconnect();
    return;
  }

  // ── 1. Create Sheikhs ────────────────────────────────────────────────
  const sheikhDocs = Array.from({ length: sheikhCount }, (_, i) => ({
    mosqueId: MOSQUE_ID,
    name: SHEIKH_NAMES[i % SHEIKH_NAMES.length],
    phone: Math.random() > 0.3 ? randomPhone() : undefined,
    notes:
      Math.random() > 0.5
        ? `مشرف حلقة ${ACTIVITIES[i % ACTIVITIES.length]}`
        : undefined,
  }));

  const insertedSheikhs = await SheikhModel.insertMany(sheikhDocs);
  console.log(`✅ Created ${insertedSheikhs.length} sheikhs`);

  // ── 2. Create Groups (one per sheikh) ────────────────────────────────
  const groupDocs = insertedSheikhs.map((sheikh, i) => ({
    mosqueId: MOSQUE_ID,
    name: `مجموعة ${sheikh.name.replace("الشيخ ", "")}`,
    activity: ACTIVITIES[i % ACTIVITIES.length],
    sheikhId: sheikh._id,
    studentIds: [] as mongoose.Types.ObjectId[],
  }));

  const insertedGroups = await GroupModel.insertMany(groupDocs);
  console.log(`✅ Created ${insertedGroups.length} groups`);

  // ── 3. Create Students ───────────────────────────────────────────────
  // Distribute students across groups evenly
  const studentsPerGroup = Math.ceil(studentCount / insertedGroups.length);

  const studentDocs = Array.from({ length: studentCount }, (_, i) => {
    const gender = i % 5 === 0 ? "female" : "male"; // ~80% male
    const group = insertedGroups[i % insertedGroups.length];
    const namePool = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
    const level = randomFrom(LEVELS);

    return {
      mosqueId: MOSQUE_ID,
      groupId: group._id,
      name: namePool[i % namePool.length],
      gender,
      level,
      birthDate: fakerEn.date.birthdate({ min: 8, max: 18, mode: "age" }),
      guardianPhone: randomPhone(),
      guardianName: MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)],
      phone: Math.random() > 0.7 ? randomPhone() : undefined,
      address:
        Math.random() > 0.5 ? `حي ${fakerEn.location.city()}` : undefined,
      enrollments: randomEnrollments(),
      trackIbadah: Math.random() > 0.6,
      currentSurah: level !== "beginner" ? randomFrom(SURAHS) : "الفاتحة",
      currentAyah: fakerEn.number.int({ min: 1, max: 50 }),
      isActive: true,
    };
  });

  const insertedStudents = await StudentModel.insertMany(studentDocs);
  console.log(`✅ Created ${insertedStudents.length} students`);

  // ── 4. Update Groups with studentIds ────────────────────────────────
  // Build group → students map
  const groupStudentsMap = new Map<string, mongoose.Types.ObjectId[]>();
  for (const student of insertedStudents) {
    const gid = student.groupId.toString();
    if (!groupStudentsMap.has(gid)) groupStudentsMap.set(gid, []);
    groupStudentsMap.get(gid)!.push(student._id as mongoose.Types.ObjectId);
  }

  // Bulk update — one operation per group
  const bulkOps = [...groupStudentsMap.entries()].map(([gid, studentIds]) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(gid) },
      update: { $set: { studentIds } },
    },
  }));

  await GroupModel.bulkWrite(bulkOps);
  console.log(`✅ Linked students to groups`);

  console.log("\n🎉 Seed complete:");
  console.log(`   Sheikhs : ${insertedSheikhs.length}`);
  console.log(`   Groups  : ${insertedGroups.length}`);
  console.log(`   Students: ${insertedStudents.length}`);
  console.log(`   MosqueId: ${MOSQUE_ID.toString()}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
