"use server";

import { connectDB }       from "@/lib/db/connect";
import Student             from "@/models/Student";
import { getMosqueId }     from "@/lib/auth/get-context";
import { studentSchema }   from "@/lib/validations/student";
import { revalidatePath }  from "next/cache";
import { redirect }        from "next/navigation";
import type { StudentFormData } from "@/lib/validations/student";

type ActionResult = { error: string } | undefined;

/**
 * saveStudentAction
 * Creates or updates a student.
 * Same redirect-outside-try/catch pattern as saveSheikhAction.
 */
export async function saveStudentAction(
  data: StudentFormData,
  id?: string
): Promise<ActionResult> {
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "بيانات غير صالحة" };
  }

  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    if (id) {
      const updated = await Student.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: parsed.data },
        { new: true, runValidators: true }
      );
      if (!updated) return { error: "الطالب غير موجود" };
    } else {
      await Student.create({ ...parsed.data, mosqueId });
    }

    revalidatePath("/students");
  } catch (error) {
    console.error("[saveStudentAction]", error);
    return { error: "حدث خطأ في الخادم، حاول مرة أخرى" };
  }

  redirect("/students");
}

/**
 * deleteStudentAction
 * Hard delete — removes student permanently.
 * To soft delete instead: replace findOneAndDelete with
 * findOneAndUpdate({ isActive: false })
 */
export async function deleteStudentAction(id: string): Promise<ActionResult> {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    const deleted = await Student.findOneAndDelete({ _id: id, mosqueId });
    if (!deleted) return { error: "الطالب غير موجود" };

    revalidatePath("/students");
  } catch (error) {
    console.error("[deleteStudentAction]", error);
    return { error: "تعذّر حذف الطالب" };
  }
}
// import Student from "@/models/Student";
// import { getMosqueId } from "../auth/get-context";
// import { connectDB } from "../db/connect";
// import { revalidatePath } from "next/cache";
// import { StudentFormData, studentSchema } from "../validations/student";
// import { redirect } from "next/navigation";


// export async function saveStudentAction(data: StudentFormData, id?: string) {
//   try {
//     const mosqueId = await getMosqueId();
//     const parsed = studentSchema.safeParse(data);

//     if (!parsed.success) {
//       return { error: "بيانات غير صالحة" };
//     }

//     await connectDB();

//     if (id) {
//       await Student.findOneAndUpdate(
//         { _id: id, mosqueId },
//         { $set: parsed.data },
//         { new: true, runValidators: true },
//       );
//     } else {
//       await Student.create({ ...parsed.data, mosqueId });
//     }

//     revalidatePath("/students");
//   } catch (error) {
//     console.error(error);
//     return { error: "حدث خطأ في السيرفر" };
//   }

//   redirect("/students");
// }


// export async function deleteStudentAction(id: string) {
//   try {
//     const mosqueId = await getMosqueId();
//     await connectDB();
//     const student = await Student.findOneAndDelete({ _id: id, mosqueId });
//     if (!student) {
//       return { error: "الطالب غير موجود" };
//     }

//     revalidatePath("/students");
//   } catch (error) {
//     console.error(error);
//     return { error: "تعذّر حذف الطالب" };
//   }
// }

// // export async function DELETE(_: NextRequest, { params }: Params) {
// //   try {
// //     const mosqueId = await getMosqueId();
// //     await connectDB();
// //     // Soft delete
// //     const student = await Student.findOneAndUpdate(
// //       { _id: params.id, mosqueId },
// //       { isActive: false },
// //       { new: true },
// //     );

// //     if (!student)
// //       return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });

// //     return NextResponse.json({ ok: true });
// //   } catch {
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }
