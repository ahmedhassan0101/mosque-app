import { ACTIVITIES } from "@/constants";
import { IGroup } from "@/types";
import { Schema, model, models, Types, Document, Model } from "mongoose";

export interface IGroupDocument extends IGroup, Document {}

const GroupSchema = new Schema<IGroupDocument>(
  {
    mosqueId: {
      type: Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    activity: {
      type: String,
      enum: ACTIVITIES.values,
      required: true,
    },
    appointment: { type: String, required: true, trim: true },
    teacherId: { type: Types.ObjectId, ref: "Teacher", required: true },
    studentIds: [{ type: Types.ObjectId, ref: "Student", required: true }],
    notes: { type: String },
  },
  { timestamps: true },
);

// Compound index: fast filtering by mosque + activity type (main list query)
GroupSchema.index({ mosqueId: 1, activity: 1 });

// Scoped uniqueness: same group name allowed across different mosques
GroupSchema.index({ mosqueId: 1, name: 1, activity: 1 }, { unique: true });

const Group: Model<IGroupDocument> =
  models.Group ?? model<IGroupDocument>("Group", GroupSchema);

export default Group;
