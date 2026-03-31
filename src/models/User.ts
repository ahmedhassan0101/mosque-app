import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types/index";
import bcrypt from "bcryptjs";

// npm install bcryptjs @types/bcryptjs

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
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
      select: false, // 🔐 hide password by default
    },
    role: {
      type: String,
      enum: ["admin", "sheikh", "supervisor"],
      default: "supervisor",
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password when sending user data to client
UserSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    delete ret.password;
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
