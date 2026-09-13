import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "user" | "admin";

// آدرس‌های ذخیره‌شده‌ی کاربر (دفترچه آدرس) - برای اینکه توی چک‌اوت هر بار
// از نو تایپ نشه. ساختار فیلدهاش عمداً همون IShippingAddress توی
// Order.model.ts هست (فقط + label و isDefault) تا موقع ثبت سفارش مستقیم
// قابل استفاده باشه.
export interface IAddress {
  _id: Types.ObjectId;
  label: string; // مثلاً «خانه» یا «محل کار»
  fullName: string;
  phone: string;
  landlinePhone?: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  role: UserRole;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, required: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  landlinePhone: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

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
    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
