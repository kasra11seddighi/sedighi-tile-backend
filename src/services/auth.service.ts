import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User.model";
import { Otp } from "../models/Otp.model";
import { ApiError } from "../utils/ApiError";
import { sendOtpSms } from "../utils/smsProvider";
import { env } from "../config/env";
import { SendOtpInput, VerifyOtpInput } from "../validations/auth.validation";

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

const toPublicUser = (user: Pick<IUser, "_id" | "name" | "phone" | "role">) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  role: user.role,
});

// تولید کد ۶ رقمی تصادفی (crypto به‌جای Math.random برای امنیت بیشتر)
const generateOtpCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * قدم اول: گرفتن شماره موبایل و ارسال کد تایید.
 * همچنین مشخص می‌کند که آیا این شماره از قبل ثبت‌نام کرده یا کاربر جدید است
 * تا فرانت‌اند بداند فرم «نام» را هم نمایش بدهد یا نه.
 */
export const sendOtp = async ({ phone }: SendOtpInput) => {
  const existing = await Otp.findOne({ phone });

  if (existing) {
    const secondsSinceLastSend = (Date.now() - existing.lastSentAt.getTime()) / 1000;
    if (secondsSinceLastSend < env.OTP_RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(env.OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend);
      throw new ApiError(429, `لطفاً ${wait} ثانیه دیگر دوباره تلاش کنید.`);
    }
  }

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_IN_SECONDS * 1000);

  await Otp.findOneAndUpdate(
    { phone },
    { codeHash, expiresAt, attempts: 0, lastSentAt: new Date() },
    { upsert: true },
  );

  await sendOtpSms(phone, code);

  const user = await User.findOne({ phone });

  return {
    message: "کد تایید ارسال شد.",
    isNewUser: !user,
    expiresInSeconds: env.OTP_EXPIRES_IN_SECONDS,
  };
};

/**
 * قدم دوم: بررسی کد تایید. اگر کاربر وجود نداشت، با نام ارسالی ساخته می‌شود.
 */
export const verifyOtp = async ({ phone, code, name }: VerifyOtpInput) => {
  const otpRecord = await Otp.findOne({ phone });

  if (!otpRecord) {
    throw new ApiError(400, "کد تاییدی برای این شماره ارسال نشده است.");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    await otpRecord.deleteOne();
    throw new ApiError(400, "کد تایید منقضی شده است. دوباره درخواست دهید.");
  }

  if (otpRecord.attempts >= env.OTP_MAX_ATTEMPTS) {
    await otpRecord.deleteOne();
    throw new ApiError(429, "تعداد تلاش‌های مجاز تمام شده است. دوباره درخواست دهید.");
  }

  const isMatch = await bcrypt.compare(code, otpRecord.codeHash);
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError(400, "کد تایید اشتباه است.");
  }

  // کد درست بود؛ رکورد OTP دیگر لازم نیست
  await otpRecord.deleteOne();

  let user = await User.findOne({ phone });

  if (!user) {
    if (!name) {
      throw new ApiError(400, "برای ثبت‌نام، وارد کردن نام الزامی است.");
    }
    user = await User.create({ phone, name });
  }

  const token = generateToken(user._id.toString());

  return { user: toPublicUser(user), token };
};

// پنل ادمین - لیست کاربران ثبت‌نامی (بدون صفحه‌بندی، فعلاً فقط برای شمارش/نمایش ساده)
export const getAllUsers = async () => {
  return User.find().select("name phone role createdAt").sort({ createdAt: -1 });
};
