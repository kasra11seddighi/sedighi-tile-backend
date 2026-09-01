import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
}

// هر شماره موبایل فقط یک رکورد OTP فعال دارد؛ با هر ارسال جدید رکورد قبلی بازنویسی می‌شود.
const otpSchema = new Schema<IOtp>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^09\d{9}$/, "شماره موبایل نامعتبر است"],
    },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    // تعداد تلاش‌های ناموفق برای وارد کردن کد؛ بعد از حد مجاز، کد باطل می‌شود
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// اسناد منقضی‌شده به‌صورت خودکار توسط MongoDB پاک می‌شوند (TTL index)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>("Otp", otpSchema);
