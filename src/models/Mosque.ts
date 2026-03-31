import mongoose, { Schema, Document, Model } from "mongoose";
import { IMosque } from "@/types/index";

export interface IMosqueDocument extends IMosque, Document {}

const MosqueSchema = new Schema<IMosqueDocument>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true },
);

const Mosque: Model<IMosqueDocument> =
  mongoose.models.Mosque ??
  mongoose.model<IMosqueDocument>("Mosque", MosqueSchema);

export default Mosque;
