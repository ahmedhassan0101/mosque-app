import mongoose, { Schema, Document, Model } from "mongoose";
import type { ActivityType } from "@/types";

export interface IGroupDocument extends Document {
  mosqueId:   mongoose.Types.ObjectId;
  name:       string;
  activity:   ActivityType;
  sheikhId:   mongoose.Types.ObjectId;
  studentIds: mongoose.Types.ObjectId[];
  notes?:     string;
}

const GroupSchema = new Schema<IGroupDocument>(
  {
    mosqueId:   { type: Schema.Types.ObjectId, ref: "Mosque",  required: true, index: true },
    name:       { type: String, required: true, trim: true },
    activity:   { type: String, enum: ["quran","tarbiya","tajweed","maqraa","playground"], required: true },
    sheikhId:   { type: Schema.Types.ObjectId, ref: "Sheikh",  required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    notes:      { type: String },
  },
  { timestamps: true }
);

GroupSchema.index({ mosqueId: 1, activity: 1 });

const Group: Model<IGroupDocument> =
  mongoose.models.Group ?? mongoose.model("Group", GroupSchema);

export default Group;