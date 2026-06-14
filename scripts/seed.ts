// scripts/seed.ts
/**
 * Mosque ERP — Database Seeder
 *
 * Usage:
 *   npx tsx scripts/seed.ts                         # seed with defaults
 *   npx tsx scripts/seed.ts --clean                 # drop existing data first
 *   npx tsx scripts/seed.ts --teachers=5 --students=50
 *   npx tsx scripts/seed.ts --clean --teachers=3 --students=30
 *
 * Determinism strategy:
 *   - Names, group names, surahs — fixed arrays (identical every run)
 *   - Phones, birth dates — faker with a fixed seed (same sequence every run)
 *   - IDs — generated fresh each run (unavoidable with MongoDB)
 *
 * Architecture rules enforced:
 *   - Group is the ONLY source of truth for relationships
 *   - Teacher has NO reference to groups or students
 *   - Student has NO reference to groups or teachers
 *   - student.enrollments is updated AFTER group creation (mirrors production logic)
 */

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { ACTIVITIES, ActivityType, LEVELS } from "@/constants";

dotenv.config({ path: ".env.local" });

// ── Fixed faker seed for deterministic phone/date generation ──────────────────
// Same seed = same sequence of random numbers every run
faker.seed(42);

// ─────────────────────────────────────────────────────────────────────────────
// INLINE SCHEMAS
// We redefine schemas here to avoid importing Next.js app models into Node.js.
// These must stay in sync with the actual model files manually.
// ─────────────────────────────────────────────────────────────────────────────

const TeacherSchema = new mongoose.Schema(
  {
    mosqueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    image: { type: String },
    notes: { type: String },
    // NO groupIds — Group is the single source of truth
  },
  { timestamps: true },
);

const StudentSchema = new mongoose.Schema(
  {
    mosqueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    guardians: [
      {
        relation: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        _id: false,
      },
    ],
    phone: { type: String },
    address: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    enrollments: {
      type: [String],
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
      default: [],
    },
    currentSurah: { type: String },
    currentAyah: { type: Number },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    // NO groupIds — Group is the single source of truth
  },
  { timestamps: true },
);

const GroupSchema = new mongoose.Schema(
  {
    mosqueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    activity: {
      type: String,
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    appointment: { type: String, required: true, trim: true },
    notes: { type: String },
  },
  { timestamps: true },
);

const TeacherModel =
  mongoose.models.Teacher ?? mongoose.model("Teacher", TeacherSchema);
const StudentModel =
  mongoose.models.Student ?? mongoose.model("Student", StudentSchema);
const GroupModel =
  mongoose.models.Group ?? mongoose.model("Group", GroupSchema);

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA POOLS
// Fixed arrays = same names every run regardless of faker state
// ─────────────────────────────────────────────────────────────────────────────
const TEACHER_NAMES = [
  "الشيخ أحمد عبدالتواب",
  "الشيخ محمد الشناوي",
  "الشيخ محمود البنا",
  "الشيخ إبراهيم الدسوقي",
  "الشيخ مصطفى فوزي",
  "الشيخ عبدالرحمن أبو زيد",
  "الشيخ خالد المصري",
  "الشيخ يوسف السيد",
];

const MALE_NAMES = [
  "أحمد السيد عبدالحميد",
  "محمد رمضان الشاذلي",
  "محمود عبدالعزيز حسن",
  "عبدالله فؤاد شلبي",
  "يوسف أحمد بدوي",
  "إبراهيم محمد الجندي",
  "عمر سامح رفعت",
  "علي جمال الدين",
  "حسن طارق السقا",
  "كريم أشرف لطفي",
  "زياد وائل حمدي",
  "مصطفى أيمن عبدربه",
  "خالد محسن الشافعي",
  "عمرو ناصر فرج",
  "أحمد يسري منصور",
  "مروان حسام عوض",
  "محمد رجب سلامة",
  "شريف سيد كامل",
  "طارق بهاء الدين",
  "وليد مجدي عبدالمنعم",
  "أمير علاء صابر",
  "ياسين فتحي خليل",
  "سيف أحمد الجمال",
  "أدهم محمود دياب",
  "معاذ سامي عبدالفتاح",
];

const FEMALE_NAMES = [
  "فاطمة أحمد السيد",
  "مريم محمد عبدالفتاح",
  "آية محمود الشناوي",
  "سارة خالد فوزي",
  "نورهان أحمد بدوي",
  "أسماء طارق لطفي",
  "ياسمين سامح رفعت",
  "منة الله محمد شلبي",
  "ندى أشرف حمدي",
  "رحمة عبدالرحمن السيد",
  "ملك مصطفى الجندي",
  "جنى وائل صابر",
];
const GUARDIAN_RELATIONS = ["أب", "أم", "أخ", "جد", "عم"];

const SURAHS = [
  "الفاتحة",
  "البقرة",
  "آل عمران",
  "النساء",
  "المائدة",
  "الأنفال",
  "الكهف",
  "مريم",
  "يس",
  "الرحمن",
  "الملك",
  "الإخلاص",
];



// Group definitions — one per activity type + names
const GROUP_DEFINITIONS: {
  name: string;
  activity: ActivityType;
  appointment: string;
}[] = [
  {
    name: "حلقة الفجر",
    activity: "quran",
    appointment: "السبت والثلاثاء بعد الفجر",
  },
  {
    name: "حلقة التجويد الأساسية",
    activity: "tajweed",
    appointment: "الأحد والأربعاء بعد العصر",
  },
  {
    name: "جلسة التربية الأسبوعية",
    activity: "tarbiya",
    appointment: "الجمعة بعد المغرب",
  },
  {
    name: "مقرأة الشيوخ",
    activity: "maqraa",
    appointment: "الاثنين والخميس بعد العشاء",
  },
  {
    name: "نشاط الملعب",
    activity: "playground",
    appointment: "الجمعة بعد العصر",
  },
];

const ADDRESSES = [
  "شارع عباس العقاد - مدينة نصر",
  "زهراء المعادي",
  "شارع الهرم - الجيزة",
  "فيصل - محطة التعاون",
  "شبرا مصر - روض الفرج",
  "حدائق القبة",
  "بولكلي - الإسكندرية",
  "سيدي جابر - الإسكندرية",
  "طنطا - شارع البحر",
  "الزقازيق - القومية",
  "المنصورة - حي الجامعة",
  "بنها - الفلل",
  "أسيوط - شارع الجمهورية",
  "سوهاج - مدينة ناصر",
  "أسوان - العقاد",
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Picks an item by index (wraps around) — deterministic, no randomness */
function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

/** Generates an Egyptian mobile number — faker.seed ensures same sequence */
function randomPhone(): string {
  const prefixes = ["010", "011", "012", "015"];
  const prefix = pick(prefixes, faker.number.int({ min: 0, max: 3 }));
  return `${prefix}${faker.string.numeric(8)}`;
}

/** Returns true ~N% of the time — uses faker for determinism */
function chance(percent: number): boolean {
  return faker.number.int({ min: 1, max: 100 }) <= percent;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEEDER
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const args = process.argv.slice(2);
  const clean = args.includes("--clean");
  const teacherCount = Number(
    args.find((a) => a.startsWith("--teachers="))?.split("=")[1] ?? 5,
  );
  const studentCount = Number(
    args.find((a) => a.startsWith("--students="))?.split("=")[1] ?? 40,
  );

  // MOSQUE_ID: use env var for consistency, fallback to a fixed ObjectId
  const MOSQUE_ID = new mongoose.Types.ObjectId(
    process.env.SEED_MOSQUE_ID ?? "000000000000000000000001",
  );

  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected\n");

  // ── Optional clean ─────────────────────────────────────────────────────────
  if (clean) {
    await Promise.all([
      TeacherModel.deleteMany({ mosqueId: MOSQUE_ID }),
      StudentModel.deleteMany({ mosqueId: MOSQUE_ID }),
      GroupModel.deleteMany({ mosqueId: MOSQUE_ID }),
    ]);
    console.log(
      "🗑️  Cleared existing data for mosqueId:",
      MOSQUE_ID.toString(),
    );
  }

  // ── Idempotency check ──────────────────────────────────────────────────────
  const existingCount = await TeacherModel.countDocuments({
    mosqueId: MOSQUE_ID,
  });
  if (existingCount > 0 && !clean) {
    console.log(`⚠️  Data already exists (${existingCount} teachers found).`);
    console.log(
      "    Run with --clean to reset, or use a different SEED_MOSQUE_ID.",
    );
    await mongoose.disconnect();
    return;
  }

  // ── STEP 1: Create Teachers ────────────────────────────────────────────────
  // Teachers have NO reference to groups — they're standalone
  const teacherDocs = Array.from({ length: teacherCount }, (_, i) => ({
    mosqueId: MOSQUE_ID,
    name: pick(TEACHER_NAMES, i),
    phone: chance(80) ? randomPhone() : undefined,
    notes: chance(40) ? `معلم متخصص في ${pick(ACTIVITIES.values, i)}` : undefined,
  }));

  const insertedTeachers = await TeacherModel.insertMany(teacherDocs);
  console.log(`✅ Step 1: Created ${insertedTeachers.length} teachers`);

  // ── STEP 2: Create Students ────────────────────────────────────────────────
  // Students have NO reference to groups — Group handles the relationship
  const studentDocs = Array.from({ length: studentCount }, (_, i) => {
    // ~20% female, ~80% male — deterministic via index
    const gender = i % 5 === 0 ? "female" : "male";
    const namePool = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
    const level = pick(LEVELS.values, i);

    return {
      mosqueId: MOSQUE_ID,
      name: pick(namePool, i),
      gender,
      level,
      birthDate: faker.date.birthdate({ min: 8, max: 18, mode: "age" }),
      guardians: [
        {
          relation: pick(GUARDIAN_RELATIONS, i),
          phone: randomPhone(),
        },
      ],
      phone: chance(30) ? randomPhone() : undefined,
      address: chance(60) ? pick(ADDRESSES, i) : undefined,
      // enrollments starts EMPTY — will be populated after group assignment
      enrollments: [] as ActivityType[],
      currentSurah: level !== "beginner" ? pick(SURAHS, i) : "الفاتحة",
      currentAyah: faker.number.int({ min: 1, max: 50 }),
      isActive: true,
    };
  });

  const insertedStudents = await StudentModel.insertMany(studentDocs);
  console.log(`✅ Step 2: Created ${insertedStudents.length} students`);

  // ── STEP 3: Create Groups and assign students ──────────────────────────────
  /**
   * Strategy:
   * - Create one group per GROUP_DEFINITION (one per activity type)
   * - Distribute students across groups evenly by index
   * - Each student goes into exactly one group (matches realistic scenario)
   */

  // Map: groupIndex → array of student ObjectIds assigned to it
  const groupStudentMap = new Map<number, mongoose.Types.ObjectId[]>(
    GROUP_DEFINITIONS.map((_, i) => [i, []]),
  );

  insertedStudents.forEach((student, i) => {
    const groupIndex = i % GROUP_DEFINITIONS.length;
    groupStudentMap
      .get(groupIndex)!
      .push(student._id as mongoose.Types.ObjectId);
  });

  // Build group documents
  const groupDocs = GROUP_DEFINITIONS.map((def, i) => ({
    mosqueId: MOSQUE_ID,
    name: def.name,
    activity: def.activity,
    appointment: def.appointment,
    // Assign teachers round-robin across groups
    teacherId: insertedTeachers[i % insertedTeachers.length]._id,
    studentIds: groupStudentMap.get(i) ?? [],
    notes: chance(50)
      ? `مجموعة ${def.name} — تأسست لخدمة طلاب المسجد`
      : undefined,
  }));

  const insertedGroups = await GroupModel.insertMany(groupDocs);
  console.log(`✅ Step 3: Created ${insertedGroups.length} groups`);

  // ── STEP 4: Update student enrollments ────────────────────────────────────
  /**
   * This mirrors exactly what happens in production (group.actions.ts →
   * syncStudentEnrollments). When a student is added to a group, their
   * enrollments array is updated with the group's activity type.
   *
   * We use bulkWrite with $addToSet to:
   * 1. Be idempotent (safe to run multiple times)
   * 2. Avoid duplicates if a student somehow ends up in two groups of the same activity
   * 3. Perform a single DB round-trip instead of N individual updates
   */
  const enrollmentBulkOps = insertedGroups.flatMap((group) => {
    const studentIds = group.studentIds as mongoose.Types.ObjectId[];
    if (studentIds.length === 0) return [];

    return [
      {
        updateMany: {
          filter: { _id: { $in: studentIds } },
          update: { $addToSet: { enrollments: group.activity } },
        },
      },
    ];
  });

  if (enrollmentBulkOps.length > 0) {
    await StudentModel.bulkWrite(enrollmentBulkOps);
  }
  console.log(`✅ Step 4: Updated student enrollments`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────");
  console.log("🎉 Seed complete");
  console.log("─────────────────────────────────");
  console.log(`   MosqueId : ${MOSQUE_ID.toString()}`);
  console.log(`   Teachers : ${insertedTeachers.length}`);
  console.log(`   Students : ${insertedStudents.length}`);
  console.log(`   Groups   : ${insertedGroups.length}`);
  console.log("─────────────────────────────────\n");

  // Log group breakdown for visual verification
  insertedGroups.forEach((group, i) => {
    const count = groupStudentMap.get(i)?.length ?? 0;
    console.log(`   ${group.name} (${group.activity}) — ${count} students`);
  });

  await mongoose.disconnect();
  console.log("\n✅ Disconnected");
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
