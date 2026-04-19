import mongoose, { Document, Model, Schema } from "mongoose";
import { nanoid } from "nanoid";

export interface IMosque extends Document {
  id: string;
  name: string;
  address: string;
  phone: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const mosqueSchema = new Schema<IMosque>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Unique 8-char code shared by admin to invite sheikhs
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(8).toUpperCase(),
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    //   transform(_, ret) {
    //     ret.id = ret._id.toString();
    //     delete (ret as any)._id;
    //     delete (ret as any).__v;
    //     // The operand of a 'delete' operator must be optional.
    //   },
    // },
  },
);


export const Mosque: Model<IMosque> =
  mongoose.models.Mosque ?? mongoose.model<IMosque>("Mosque", mosqueSchema);
