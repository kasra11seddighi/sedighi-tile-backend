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
  // طول کد رو ثابت فرض نمی‌کنیم چون خودِ ملی‌پیامک تولیدش می‌کنه و تو
  // نمونه‌ی رسمی‌شون کد ۱۰ رقمی برگردونده (نه ۶ رقمی مثل قبل)؛ فقط عددی
  // بودن رو با یه بازه‌ی منطقی چک می‌کنیم
  code: z.string().trim().regex(/^\d{4,12}$/, "کد تایید نامعتبر است"),
  // فقط برای کاربر جدید لازم است؛ اگر کاربر از قبل ثبت‌نام کرده باشد نادیده گرفته می‌شود
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد").optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const updateProfileSchema = z.object({
  // شماره موبایل عمداً اینجا نیست: چون شناسه‌ی ورود/ثبت‌نامه، تغییرش
  // نیازمند تایید مجدد با OTP هست، نه یه ویرایش ساده‌ی پروفایل.
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, "عنوان آدرس الزامی است"),
  fullName: z.string().trim().min(2, "نام گیرنده باید حداقل ۲ کاراکتر باشد"),
  phone: phoneField,
  landlinePhone: z.string().trim().optional(),
  address: z.string().trim().min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
  city: z.string().trim().min(1, "شهر الزامی است"),
  postalCode: z.string().trim().min(5, "کد پستی نامعتبر است"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = addressSchema.partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
