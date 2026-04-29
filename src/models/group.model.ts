import { Schema, model, models, Types, Document, Model } from "mongoose";
export type ActivityType =
  | "quran"
  | "tarbiya"
  | "tajweed"
  | "maqraa"
  | "playground";

export interface IGroup {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  teacherId: Types.ObjectId;
  activity: ActivityType;
  appointment?: string;
  studentIds: Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupDocument extends Omit<IGroup, "_id">, Document {}
// export interface IGroupDocument extends IGroup, Document {}

const GroupSchema = new Schema<IGroupDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    activity: {
      type: String,
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
      required: true,
    },
    appointment: { type: String },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    studentIds: [{ type: Types.ObjectId, ref: "Student" }],
    notes: { type: String },
  },
  { timestamps: true },
);

const Group: Model<IGroupDocument> =
  models.Group ?? model("Group", GroupSchema);

export default Group;
