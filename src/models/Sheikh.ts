import mongoose, { Schema, Document, Model } from "mongoose";
import { ISheikh } from "@/types/index";

export interface ISheikhDocument extends Omit<ISheikh, "_id">, Document {}

const SheikhSchema = new Schema<ISheikhDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    photo: { type: String },
    phone: { type: String },
    notes: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true },
);

const Sheikh: Model<ISheikhDocument> =
  mongoose.models.Sheikh ??
  mongoose.model<ISheikhDocument>("Sheikh", SheikhSchema);

export default Sheikh;
