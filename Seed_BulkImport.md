# Seed + Bulk Import — Production Implementation

---

## Task 1: Database Seeding

### الاختيار: Script-based مع @faker-js/faker

| الخيار | المشكلة |
|--------|---------|
| JSON files | static — مش randomized |
| faker | randomized + realistic + idempotent ✅ |

```bash
npm install -D @faker-js/faker tsx
```

---

### `scripts/seed.ts`

```ts
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
const StudentSchema = new mongoose.Schema({
  mosqueId:      { type: mongoose.Schema.Types.ObjectId, required: true },
  name:          { type: String, required: true },
  birthDate:     Date,
  phone:         String,
  guardianName:  String,
  guardianPhone: { type: String, required: true },
  address:       String,
  photo:         String,
  gender:        { type: String, enum: ["male", "female"] },
  level:         { type: String, enum: ["beginner", "intermediate", "advanced"] },
  groupId:       mongoose.Schema.Types.ObjectId,
  enrollments:   [String],
  trackIbadah:   { type: Boolean, default: false },
  currentSurah:  String,
  currentAyah:   Number,
  notes:         String,
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

const SheikhSchema = new mongoose.Schema({
  mosqueId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name:     { type: String, required: true },
  phone:    String,
  photo:    String,
  notes:    String,
}, { timestamps: true });

const GroupSchema = new mongoose.Schema({
  mosqueId:   { type: mongoose.Schema.Types.ObjectId, required: true },
  name:       { type: String, required: true },
  activity:   { type: String, enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"] },
  sheikhId:   mongoose.Schema.Types.ObjectId,
  studentIds: [mongoose.Schema.Types.ObjectId],
  notes:      String,
}, { timestamps: true });

const StudentModel = mongoose.models.Student || mongoose.model("Student", StudentSchema);
const SheikhModel  = mongoose.models.Sheikh  || mongoose.model("Sheikh",  SheikhSchema);
const GroupModel   = mongoose.models.Group   || mongoose.model("Group",   GroupSchema);

// ── Arabic data pools ────────────────────────────────────────────────────
const MALE_NAMES = [
  "أحمد محمد", "عمر خالد", "عبدالله يوسف", "محمد إبراهيم", "يوسف عبدالرحمن",
  "إبراهيم حسن", "علي أحمد", "حسن محمود", "عبدالرحمن سعيد", "زياد طارق",
  "سلمان فهد", "ماجد عبدالله", "فيصل محمد", "تركي عبدالعزيز", "بدر خالد",
  "سعد عمر", "نواف سلطان", "عبدالعزيز ناصر", "راشد حمد", "منصور صالح",
];

const FEMALE_NAMES = [
  "فاطمة أحمد", "عائشة محمد", "مريم عبدالله", "زينب علي", "نور خالد",
  "سارة إبراهيم", "هند محمد", "لين عمر", "رهف سعيد", "دانا يوسف",
];

const SHEIKH_NAMES = [
  "الشيخ أحمد الغامدي", "الشيخ محمد العتيبي", "الشيخ عبدالله الشمري",
  "الشيخ يوسف الزهراني", "الشيخ إبراهيم القحطاني", "الشيخ عمر الدوسري",
  "الشيخ خالد المطيري", "الشيخ علي العنزي",
];

const SURAHS = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
  "الأنعام", "الأعراف", "الكهف", "يس", "الملك",
];

const ACTIVITIES = ["quran", "tarbiya", "tajweed", "maqraa", "playground"] as const;
const LEVELS     = ["beginner", "intermediate", "advanced"] as const;
const GENDERS    = ["male", "female"] as const;

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
  const args        = process.argv.slice(2);
  const clean       = args.includes("--clean");
  const sheikhCount = Number(args.find(a => a.startsWith("--sheikhs="))?.split("=")[1] ?? 6);
  const studentCount = Number(args.find(a => a.startsWith("--students="))?.split("=")[1] ?? 40);

  const MOSQUE_ID = new mongoose.Types.ObjectId(
    process.env.SEED_MOSQUE_ID ?? "000000000000000000000001"
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
    console.log(`⚠️  Data already exists (${existing} sheikhs). Use --clean to reset.`);
    await mongoose.disconnect();
    return;
  }

  // ── 1. Create Sheikhs ────────────────────────────────────────────────
  const sheikhDocs = Array.from({ length: sheikhCount }, (_, i) => ({
    mosqueId: MOSQUE_ID,
    name:     SHEIKH_NAMES[i % SHEIKH_NAMES.length],
    phone:    Math.random() > 0.3 ? randomPhone() : undefined,
    notes:    Math.random() > 0.5 ? `مشرف حلقة ${ACTIVITIES[i % ACTIVITIES.length]}` : undefined,
  }));

  const insertedSheikhs = await SheikhModel.insertMany(sheikhDocs);
  console.log(`✅ Created ${insertedSheikhs.length} sheikhs`);

  // ── 2. Create Groups (one per sheikh) ────────────────────────────────
  const groupDocs = insertedSheikhs.map((sheikh, i) => ({
    mosqueId:   MOSQUE_ID,
    name:       `مجموعة ${sheikh.name.replace("الشيخ ", "")}`,
    activity:   ACTIVITIES[i % ACTIVITIES.length],
    sheikhId:   sheikh._id,
    studentIds: [] as mongoose.Types.ObjectId[],
  }));

  const insertedGroups = await GroupModel.insertMany(groupDocs);
  console.log(`✅ Created ${insertedGroups.length} groups`);

  // ── 3. Create Students ───────────────────────────────────────────────
  // Distribute students across groups evenly
  const studentsPerGroup = Math.ceil(studentCount / insertedGroups.length);

  const studentDocs = Array.from({ length: studentCount }, (_, i) => {
    const gender  = i % 5 === 0 ? "female" : "male"; // ~80% male
    const group   = insertedGroups[i % insertedGroups.length];
    const namePool = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
    const level   = randomFrom(LEVELS);

    return {
      mosqueId:      MOSQUE_ID,
      groupId:       group._id,
      name:          namePool[i % namePool.length],
      gender,
      level,
      birthDate:     fakerEn.date.birthdate({ min: 8, max: 18, mode: "age" }),
      guardianPhone: randomPhone(),
      guardianName:  MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)],
      phone:         Math.random() > 0.7 ? randomPhone() : undefined,
      address:       Math.random() > 0.5 ? `حي ${fakerEn.location.city()}` : undefined,
      enrollments:   randomEnrollments(),
      trackIbadah:   Math.random() > 0.6,
      currentSurah:  level !== "beginner" ? randomFrom(SURAHS) : "الفاتحة",
      currentAyah:   fakerEn.number.int({ min: 1, max: 50 }),
      isActive:      true,
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
```

### `package.json` — أضف الـ scripts

```json
{
  "scripts": {
    "seed":       "tsx scripts/seed.ts",
    "seed:clean": "tsx scripts/seed.ts --clean",
    "seed:large": "tsx scripts/seed.ts --clean --sheikhs=10 --students=100"
  }
}
```

---

## Task 2: Bulk Import (Excel/CSV)

```bash
npm install xlsx zod
```

---

### هيكل الملفات

```
src/
├── app/
│   └── api/
│       └── students/
│           └── import/
│               └── route.ts         ← upload endpoint
├── lib/
│   └── import/
│       ├── template.ts              ← generate Excel template
│       ├── parser.ts                ← parse uploaded file
│       └── validator.ts             ← Zod row validation
└── components/
    └── students/
        └── BulkImport.tsx           ← UI component
```

---

### `src/lib/import/template.ts`

```ts
/**
 * Generates a downloadable Excel template for student bulk import.
 * Includes headers, sample row, and column notes.
 */
import * as XLSX from "xlsx";

const HEADERS = [
  "الاسم *",
  "الجنس * (male/female)",
  "تاريخ الميلاد (YYYY-MM-DD)",
  "المستوى * (beginner/intermediate/advanced)",
  "تليفون الطالب",
  "اسم ولي الأمر",
  "تليفون ولي الأمر *",
  "تليفون ولي الأمر 2",
  "العنوان",
  "الأنشطة * (quran,tarbiya,tajweed,maqraa,playground)",
  "متابعة العبادات (true/false)",
  "السورة الحالية",
  "رقم الآية",
  "ملاحظات",
];

const SAMPLE_ROW = [
  "أحمد محمد علي",
  "male",
  "2012-05-15",
  "beginner",
  "01012345678",
  "محمد علي",
  "01098765432",
  "",
  "القاهرة",
  "quran,tarbiya",
  "false",
  "الفاتحة",
  "1",
  "",
];

export function generateImportTemplate(): Buffer {
  const wb = XLSX.utils.book_new();

  // Data sheet
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, SAMPLE_ROW]);

  // Column widths
  ws["!cols"] = HEADERS.map(() => ({ wch: 28 }));

  XLSX.utils.book_append_sheet(wb, ws, "الطلاب");

  // Reference sheet — allowed values
  const refWs = XLSX.utils.aoa_to_sheet([
    ["الحقل", "القيم المسموحة"],
    ["الجنس",   "male | female"],
    ["المستوى", "beginner | intermediate | advanced"],
    ["الأنشطة", "quran | tarbiya | tajweed | maqraa | playground (مفصولة بفاصلة)"],
    ["متابعة العبادات", "true | false"],
  ]);
  refWs["!cols"] = [{ wch: 20 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, refWs, "القيم المرجعية");

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}
```

---

### `src/lib/import/validator.ts`

```ts
import { z } from "zod";

const ACTIVITIES  = ["quran", "tarbiya", "tajweed", "maqraa", "playground"] as const;
const LEVELS      = ["beginner", "intermediate", "advanced"] as const;
const GENDERS     = ["male", "female"] as const;

/**
 * Zod schema for a single import row.
 * Coerces empty strings to undefined for optional fields.
 */
export const importRowSchema = z.object({
  name: z
    .string({ required_error: "الاسم مطلوب" })
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100),

  gender: z.enum(GENDERS, {
    errorMap: () => ({ message: "الجنس يجب أن يكون male أو female" }),
  }),

  birthDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine(
      (d) => !d || !isNaN(d.getTime()),
      "تاريخ الميلاد غير صحيح، استخدم صيغة YYYY-MM-DD"
    ),

  level: z.enum(LEVELS, {
    errorMap: () => ({ message: "المستوى يجب أن يكون beginner أو intermediate أو advanced" }),
  }),

  phone:          z.string().optional(),
  guardianName:   z.string().optional(),

  guardianPhone: z
    .string({ required_error: "تليفون ولي الأمر مطلوب" })
    .min(10, "رقم التليفون يجب أن يكون 10 أرقام على الأقل"),

  guardianPhone2: z.string().optional(),
  address:        z.string().optional(),

  enrollments: z
    .string({ required_error: "الأنشطة مطلوبة" })
    .transform((v) =>
      v.split(",").map((s) => s.trim()).filter(Boolean)
    )
    .pipe(
      z.array(z.enum(ACTIVITIES, {
        errorMap: () => ({ message: "نشاط غير صحيح" }),
      })).min(1, "يجب اختيار نشاط واحد على الأقل")
    ),

  trackIbadah: z
    .string()
    .optional()
    .transform((v) => v?.toLowerCase() === "true"),

  currentSurah: z.string().optional(),
  currentAyah:  z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine(
      (n) => n === undefined || (!isNaN(n) && n > 0),
      "رقم الآية يجب أن يكون رقماً موجباً"
    ),

  notes: z.string().optional(),
});

export type ImportRow    = z.infer<typeof importRowSchema>;
export type ImportInput  = z.input<typeof importRowSchema>;

// ── Row validation result ────────────────────────────────────────────────
export type RowResult =
  | { row: number; status: "valid";   data: ImportRow }
  | { row: number; status: "invalid"; errors: string[] };

/**
 * Validates all rows and returns per-row results.
 * Never throws — always returns structured results.
 */
export function validateRows(rawRows: ImportInput[]): RowResult[] {
  return rawRows.map((raw, index) => {
    const row = index + 2; // +2 because row 1 = header
    const result = importRowSchema.safeParse(raw);

    if (result.success) {
      return { row, status: "valid", data: result.data };
    }

    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return { row, status: "invalid", errors };
  });
}
```

---

### `src/lib/import/parser.ts`

```ts
import * as XLSX from "xlsx";
import type { ImportInput } from "./validator";

// Map from Arabic header → field key
const HEADER_MAP: Record<string, keyof ImportInput> = {
  "الاسم *":                                             "name",
  "الجنس * (male/female)":                               "gender",
  "تاريخ الميلاد (YYYY-MM-DD)":                          "birthDate",
  "المستوى * (beginner/intermediate/advanced)":           "level",
  "تليفون الطالب":                                        "phone",
  "اسم ولي الأمر":                                       "guardianName",
  "تليفون ولي الأمر *":                                  "guardianPhone",
  "تليفون ولي الأمر 2":                                  "guardianPhone2",
  "العنوان":                                             "address",
  "الأنشطة * (quran,tarbiya,tajweed,maqraa,playground)": "enrollments",
  "متابعة العبادات (true/false)":                        "trackIbadah",
  "السورة الحالية":                                      "currentSurah",
  "رقم الآية":                                           "currentAyah",
  "ملاحظات":                                             "notes",
};

/**
 * Parses an uploaded Excel or CSV file into raw row objects.
 * Maps Arabic headers to field keys using HEADER_MAP.
 * Skips empty rows automatically.
 */
export function parseImportFile(buffer: Buffer): ImportInput[] {
  const wb  = XLSX.read(buffer, { type: "buffer", cellDates: true });

  // Always use the first sheet
  const ws  = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",       // empty cells → empty string
    raw:    false,    // format dates as strings
  });

  return raw
    .filter((row) =>
      // Skip completely empty rows
      Object.values(row).some((v) => String(v).trim() !== "")
    )
    .map((row) => {
      const mapped: Partial<ImportInput> = {};
      for (const [arabicHeader, fieldKey] of Object.entries(HEADER_MAP)) {
        const value = row[arabicHeader];
        (mapped as any)[fieldKey] = value !== undefined ? String(value).trim() : "";
      }
      return mapped as ImportInput;
    });
}
```

---

### `src/app/api/students/import/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { getMosqueId }    from "@/lib/auth/get-context";
import { connectDB }      from "@/lib/db/connect";
import Student            from "@/models/Student";
import { parseImportFile } from "@/lib/import/parser";
import { validateRows }    from "@/lib/import/validator";
import { generateImportTemplate } from "@/lib/import/template";

/**
 * GET /api/students/import
 * Download the Excel template
 */
export async function GET() {
  try {
    const buffer = generateImportTemplate();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="students-template.xlsx"',
      },
    });
  } catch {
    return NextResponse.json({ error: "تعذّر إنشاء النموذج" }, { status: 500 });
  }
}

/**
 * POST /api/students/import
 * Upload and import students from Excel/CSV
 *
 * Returns:
 * {
 *   inserted: number,
 *   failed:   number,
 *   errors:   { row, errors }[]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();

    // ── 1. Parse multipart form ──────────────────────────────────────
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف" },
        { status: 400 }
      );
    }

    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { error: "يُسمح فقط بملفات Excel أو CSV" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الملف يجب أن يكون أقل من 5MB" },
        { status: 400 }
      );
    }

    // ── 2. Parse file ────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawRows = parseImportFile(buffer);

    if (rawRows.length === 0) {
      return NextResponse.json(
        { error: "الملف فارغ أو لا يحتوي على بيانات صحيحة" },
        { status: 400 }
      );
    }

    if (rawRows.length > 500) {
      return NextResponse.json(
        { error: "الحد الأقصى 500 طالب في كل ملف" },
        { status: 400 }
      );
    }

    // ── 3. Validate all rows ─────────────────────────────────────────
    const results  = validateRows(rawRows);
    const valid    = results.filter((r) => r.status === "valid");
    const invalid  = results.filter((r) => r.status === "invalid");

    // If ALL rows fail — return immediately
    if (valid.length === 0) {
      return NextResponse.json(
        {
          inserted: 0,
          failed:   invalid.length,
          errors:   invalid.map((r) => ({
            row:    r.row,
            errors: r.status === "invalid" ? r.errors : [],
          })),
        },
        { status: 422 }
      );
    }

    // ── 4. Bulk insert valid rows ────────────────────────────────────
    await connectDB();

    const docs = valid.map((r) => {
      if (r.status !== "valid") return null;
      return { ...r.data, mosqueId, isActive: true };
    }).filter(Boolean);

    // insertMany with ordered:false — continues even if some fail
    await Student.insertMany(docs, { ordered: false });

    // ── 5. Return structured result ──────────────────────────────────
    return NextResponse.json({
      inserted: valid.length,
      failed:   invalid.length,
      errors:   invalid.map((r) => ({
        row:    r.row,
        errors: r.status === "invalid" ? r.errors : [],
      })),
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    console.error("[POST /api/students/import]", e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
```

---

### `src/components/students/BulkImport.tsx`

```tsx
"use client";

import { useState, useRef } from "react";
import { toast }     from "sonner";
import { Button }    from "@/components/ui/button";
import { Progress }  from "@/components/ui/progress";
import {
  Upload, Download, FileSpreadsheet,
  CheckCircle, AlertCircle, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportError {
  row:    number;
  errors: string[];
}

interface ImportResult {
  inserted: number;
  failed:   number;
  errors:   ImportError[];
}

export function BulkImport() {
  const inputRef            = useRef<HTMLInputElement>(null);
  const [file, setFile]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Download template ──────────────────────────────────────────────
  const handleDownloadTemplate = () => {
    window.open("/api/students/import", "_blank");
  };

  // ── File selection ─────────────────────────────────────────────────
  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    const allowed = /\.(xlsx|xls|csv)$/i;
    if (!allowed.test(selected.name)) {
      toast.error("يُسمح فقط بملفات Excel أو CSV");
      return;
    }
    setFile(selected);
    setResult(null);
  };

  // ── Upload ─────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res  = await fetch("/api/students/import", {
        method: "POST",
        body:   formData,
      });
      const data = await res.json();

      if (!res.ok && !data.inserted) {
        toast.error(data.error ?? "حدث خطأ");
        return;
      }

      setResult(data);

      if (data.inserted > 0) {
        toast.success(`تم استيراد ${data.inserted} طالب بنجاح`);
      }
      if (data.failed > 0) {
        toast.warning(`${data.failed} صف به أخطاء`);
      }
    } catch {
      toast.error("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">

      {/* Step 1 — Download template */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
        <div>
          <p className="text-sm font-medium">الخطوة 1: تحميل النموذج</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            حمّل النموذج، املأه، ثم ارفعه
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <Download size={14} className="ml-2" />
          تحميل النموذج
        </Button>
      </div>

      {/* Step 2 — Upload file */}
      <div>
        <p className="text-sm font-medium mb-2">الخطوة 2: رفع الملف</p>

        {/* Dropzone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            file && "border-primary/40 bg-primary/3"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files[0] ?? null);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet size={24} className="text-primary" />
              <div className="text-right">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                className="mr-auto text-muted-foreground hover:text-foreground"
                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">اسحب الملف هنا أو اضغط للاختيار</p>
              <p className="text-xs text-muted-foreground mt-1">Excel أو CSV · حتى 5MB</p>
            </>
          )}
        </div>

        {file && !result && (
          <Button className="w-full mt-3" onClick={handleUpload} disabled={loading}>
            {loading ? "جارٍ الاستيراد..." : "استيراد الطلاب"}
          </Button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-xl border overflow-hidden">
          {/* Summary */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle size={18} className="text-green-600" />
              <div>
                <p className="text-xs text-green-700">تم استيرادهم</p>
                <p className="text-xl font-bold text-green-800">{result.inserted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={18} className="text-red-600" />
              <div>
                <p className="text-xs text-red-700">صفوف بها أخطاء</p>
                <p className="text-xl font-bold text-red-800">{result.failed}</p>
              </div>
            </div>
          </div>

          {/* Error details */}
          {result.errors.length > 0 && (
            <div className="border-t">
              <p className="text-xs font-medium text-muted-foreground px-4 py-2">
                تفاصيل الأخطاء
              </p>
              <div className="max-h-48 overflow-y-auto divide-y">
                {result.errors.map((e) => (
                  <div key={e.row} className="px-4 py-2.5">
                    <p className="text-xs font-semibold text-red-600">
                      السطر {e.row}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {e.errors.map((msg, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          • {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## الاستخدام في صفحة الطلاب

```tsx
// src/app/(dashboard)/students/import/page.tsx
import { BulkImport } from "@/components/students/BulkImport";

export const metadata = { title: "استيراد الطلاب" };

export default function ImportStudentsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">استيراد الطلاب</h1>
        <p className="text-muted-foreground text-sm">
          استيراد بيانات طلاب متعددين دفعة واحدة من ملف Excel أو CSV
        </p>
      </div>
      <BulkImport />
    </div>
  );
}
```

---

## API Response Structure

```ts
// Success (some inserted, some failed)
// HTTP 200
{
  "inserted": 45,
  "failed":   3,
  "errors": [
    { "row": 4,  "errors": ["gender: الجنس يجب أن يكون male أو female"] },
    { "row": 12, "errors": ["guardianPhone: رقم التليفون يجب أن يكون 10 أرقام"] },
    { "row": 23, "errors": ["enrollments: يجب اختيار نشاط واحد على الأقل"] }
  ]
}

// All valid
// HTTP 200
{ "inserted": 48, "failed": 0, "errors": [] }

// All invalid
// HTTP 422
{ "inserted": 0, "failed": 48, "errors": [...] }
```

---

## ملخص القرارات

| القرار | السبب |
|--------|-------|
| `@faker-js/faker` للـ seeding | Arabic locale + realistic data |
| `bulkWrite` لتحديث المجموعات | واحدة لكل مجموعة بدل N queries |
| `insertMany` للاستيراد | أسرع من insert واحدة واحدة |
| `ordered: false` في insertMany | يكمل حتى لو فيه صفوف فاشلة |
| Zod للـ validation | type-safe + رسائل عربية |
| Arabic headers في الـ template | مريح للمستخدم العربي |
| partial failure مسموح | UX أحسن — ما يضيعش الصح بسبب الغلط |
