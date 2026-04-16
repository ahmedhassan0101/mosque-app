import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

import type { UserRole } from "@/types";
export type AuthProvider = "credentials" | "google";
// npm install bcryptjs @types/bcryptjs

export interface IUserDocument extends Document {
  mosqueId: mongoose.Types.ObjectId | null;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  provider: AuthProvider;
  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      // required: true,
      default: null,
      index: true,
    },
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
      required: true,
      minlength: 8,
      // select: false, // 🔐 hide password by default
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "sheikh", "supervisor"],
      default: "admin",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

// Sparse index — only indexes docs that have a reset token
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });

// UserSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// Hash password before save (only if modified)
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
  // next();
});

// UserSchema.methods.comparePassword = async function (candidate: string) {
//   return bcrypt.compare(candidate, this.password);
// };
UserSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Remove password when sending user data to client
// UserSchema.set("toJSON", {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   transform: (_doc, ret: any) => {
//     delete ret.password;
//     return ret;
//   },
// });
UserSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});
// UserSchema.set("toJSON", {
//   transform: (_, ret) => {
//     // // error here
//     // The operand of a 'delete' operator must be optional.
//     delete ret.password;
//     return ret;
//   },
// });

const User: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>("User", UserSchema);

export default User;
