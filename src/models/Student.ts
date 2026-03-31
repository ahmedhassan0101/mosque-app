import mongoose, { Schema, Document, Model } from "mongoose";
import { IStudent } from "@/types/index";

export interface IStudentDocument extends Omit<IStudent, "_id">, Document {}

const StudentSchema = new Schema<IStudentDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    birthYear: { type: Number, required: true },
    phone: { type: String },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, required: true },
    guardianPhone2: { type: String },
    photo: { type: String },
    address: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    enrollments: {
      type: [String],
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
      default: ["quran", "tarbiya", "playground"],
    },
    trackIbadah: { type: Boolean, default: false },
    currentSurah: { type: String },
    currentAyah: { type: Number },
    notes: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

StudentSchema.index({ mosqueId: 1, name: 1 });
StudentSchema.index({ mosqueId: 1, isActive: 1 });

const Student: Model<IStudentDocument> =
  mongoose.models.Student ??
  mongoose.model<IStudentDocument>("Student", StudentSchema);

export default Student;
