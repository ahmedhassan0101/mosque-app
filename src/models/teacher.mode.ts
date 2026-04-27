import mongoose, { Types, Document, Schema } from "mongoose";

export interface ITeacher extends Document {
  _id: Types.ObjectId; // تأكد أن الـ ID موجود هنا
  mosqueId: Types.ObjectId;
  name: string;
  phone?: string;
  image?: string;
  notes?: string;
  groupIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String },
    image: { type: String },
    notes: { type: String },
    groupIds: [{ type: Types.ObjectId, ref: "Group" }],
  },
  { timestamps: true },
);

const Teacher =
  mongoose.models.Teacher ?? mongoose.model<ITeacher>("Teacher", teacherSchema);

export default Teacher;
