// src\models\student.model.ts
import { type IGuardian, type IStudent } from "@/types";
import { Schema, model, models, Types, Document, Model } from "mongoose";

export interface IStudentDocument extends IStudent, Document {}

const guardianSchema = new Schema<IGuardian>(
  {
    relation: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const studentSchema = new Schema<IStudentDocument>(
  {
    mosqueId: {
      type: Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    guardians: {
      type: [guardianSchema],
      validate: {
        validator: function (v: IGuardian[]) {
          return v && v.length > 0;
        },
        message: "يجب إضافة وسيلة تواصل واحدة على الأقل.",
      },
    },
    phone: { type: String },
    image: { type: String },
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
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const Student: Model<IStudentDocument> =
  models.Student ?? model<IStudentDocument>("Student", studentSchema);

export default Student;
