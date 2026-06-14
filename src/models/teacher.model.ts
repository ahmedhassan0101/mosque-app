// src\models\teacher.model.ts
import { Schema, model, models, Types, Document, Model } from "mongoose";
import { type ITeacher } from "@/types";

export interface ITeacherDocument extends ITeacher, Document {}

const teacherSchema = new Schema<ITeacherDocument>(
  {
    mosqueId: {
      type: Types.ObjectId,
      ref: "Mosque",
      required: true,
      // Indexed for fast multi-tenant scoping queries
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    image: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

// Compound index: fast lookup by mosque + name (also allows same name across mosques)
teacherSchema.index({ mosqueId: 1, name: 1 });

const Teacher: Model<ITeacherDocument> =
  models.Teacher ?? model<ITeacherDocument>("Teacher", teacherSchema);

export default Teacher;

// // src/models/entity-name.model.ts
// import { Schema, model, models, Types, Document } from "mongoose";

// // ============================================================================
// // 1. DATA INTERFACE (The Source of Truth)
// // - استخدم هذا كمرجع للبيانات الصافية (مثلاً للـ Serialize<IEntityName>).
// // - يحتوي فقط على الحقول الموجودة فعلياً في قاعدة البيانات.
// // - دائماً قم بتعريف _id كـ Types.ObjectId.
// // ============================================================================
// export interface IEntityName {
//   _id: Types.ObjectId;
//   name: string;
//   isActive: boolean;
//   relatedId?: Types.ObjectId; // علاقة بموديل آخر (اختياري)
//   tags: string[];
//   createdAt: Date;            // يتم إنشاؤه تلقائياً بواسطة timestamps
//   updatedAt: Date;            // يتم إنشاؤه تلقائياً بواسطة timestamps
// }

// // ============================================================================
// // 2. DOCUMENT INTERFACE (For Server-Side Mongoose Operations)
// // - استخدم هذا *فقط* في الـ Server Actions إذا كنت تحتاج دوال مثل .save()
// // - يفصل تعقيدات Mongoose عن الواجهة الأمامية (Frontend).
// // ============================================================================
// export interface IEntityNameDocument extends IEntityName, Document {
//   _id: Types.ObjectId; // لتأكيد النوع وتجاوز الـ any الخاص بـ Document
// }

// // ============================================================================
// // 3. MONGOOSE SCHEMA
// // - يطبق قواعد التحقق (Validation) والقيم الافتراضية على مستوى قاعدة البيانات.
// // ============================================================================
// const entityNameSchema = new Schema<IEntityNameDocument>(
//   {
//     name: {
//       type: String,
//       required: [true, "الاسم مطلوب"], // رسالة خطأ مخصصة
//       trim: true, // يزيل المسافات الزائدة من البداية والنهاية
//       maxlength: [100, "الاسم يجب ألا يتجاوز 100 حرف"],
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     relatedId: {
//       type: Schema.Types.ObjectId,
//       ref: "OtherModel", // يجب أن يطابق اسم الموديل المرتبط تماماً
//     },
//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//   },
//   {
//     timestamps: true,  // يدير createdAt و updatedAt تلقائياً
//     versionKey: false, // يخفي حقل __v العشوائي من قاعدة البيانات
//   }
// );

// // ============================================================================
// // 4. MODEL EXPORT (Next.js App Router Best Practice)
// // - يمنع خطأ "Cannot overwrite model once compiled" أثناء التطوير (Hot Reload).
// // ============================================================================
// const EntityName = models.EntityName || model<IEntityNameDocument>("EntityName", entityNameSchema);

// export default EntityName;
