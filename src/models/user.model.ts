/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserRole, Provider } from "@/types";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  provider: Provider;
  mosqueId: Types.ObjectId | null;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** Compares plain-text password against stored hash */
  comparePassword(candidate: string): Promise<boolean>;
}



const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: function (this: any) {
        return this.provider === "credentials";
      },
      minlength: 8,
    },
    image: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR"],
      default: "SUPERVISOR",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    mosqueId: { type: Schema.Types.ObjectId, ref: "Mosque", default: null },
    // resetTokens: { type: [resetTokenSchema], default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).password;
        delete (ret as any).resetTokens;
      },
    },
  },
);

userSchema.index({ mosqueId: 1 });

/** Hash password before saving if modified */
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password ?? "");
};

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
