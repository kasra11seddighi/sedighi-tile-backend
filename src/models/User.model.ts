import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true, default: "" },
    // شماره موبایل، شناسه‌ی اصلی کاربر برای ورود/ثبت‌نام (به‌جای ایمیل)
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^09\d{9}$/, "شماره موبایل نامعتبر است"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
