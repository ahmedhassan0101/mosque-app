import mongoose, { Schema, Document, Model } from "mongoose";
// import { nanoid } from "nanoid";
// import { IMosque } from "@/types/index";
import crypto from "crypto";
// export interface IMosqueDocument extends IMosque, Document {}

export interface IMosqueDocument extends Document {
  name: string;
  address?: string;
  phone?: string;
  inviteCode: string;
}

const MosqueSchema = new Schema<IMosqueDocument>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    // Unique 8-char code shared by admin to invite sheikhs
    inviteCode: {
      type: String,
      unique: true,
      // default: () => nanoid(8).toUpperCase(),
      default: () => crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
  },
  { timestamps: true },
);

const Mosque: Model<IMosqueDocument> =
  mongoose.models.Mosque ??
  mongoose.model<IMosqueDocument>("Mosque", MosqueSchema);

export default Mosque;
