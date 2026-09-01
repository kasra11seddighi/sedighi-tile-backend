import { z } from "zod";

const phoneField = z
  .string()
  .trim()
  .regex(/^09\d{9}$/, "شماره موبایل نامعتبر است (مثال: 09123456789)");

export const sendOtpSchema = z.object({
  phone: phoneField,
});

export const verifyOtpSchema = z.object({
  phone: phoneField,
  code: z.string().trim().regex(/^\d{6}$/, "کد تایید باید ۶ رقم باشد"),
  // فقط برای کاربر جدید لازم است؛ اگر کاربر از قبل ثبت‌نام کرده باشد نادیده گرفته می‌شود
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد").optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
