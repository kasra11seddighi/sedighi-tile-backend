import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, IUser, IAddress } from "../models/User.model";
import { Otp } from "../models/Otp.model";
import { ApiError } from "../utils/ApiError";
import { requestOtpCode } from "../utils/otpProvider";
import { env } from "../config/env";
import { SendOtpInput, VerifyOtpInput, AddressInput } from "../validations/auth.validation";

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

/**
 * فقط محیط توسعه/تست: اگه TEST_OTP_PHONE ست شده باشه و شماره‌ی ورودی
 * دقیقاً همونه، به‌جای پیامک واقعی یه کد ثابت (TEST_OTP_CODE) استفاده
 * می‌کنیم تا لازم نباشه موقع تست هی پیامک واقعی بزنیم. توی production
 * همیشه false برمی‌گرده، حتی اگه این envها ست شده باشن.
 */
const isTestBypassPhone = (phone: string): boolean =>
  env.NODE_ENV !== "production" &&
  Boolean(env.TEST_OTP_PHONE) &&
  phone === env.TEST_OTP_PHONE;

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

  // شماره‌ی تستی: پیامک واقعی نمی‌فرستیم، کد ثابت رو استفاده می‌کنیم
  const code = isTestBypassPhone(phone)
    ? env.TEST_OTP_CODE || "123456"
    : await requestOtpCode(phone);

  if (isTestBypassPhone(phone)) {
    console.log(`🧪 [TEST BYPASS] کد تایید ثابت برای ${phone}: ${code} (پیامکی ارسال نشد)`);
  }

  // ملی‌پیامک خودش کد رو تولید و پیامک می‌کنه و همون کد رو برمی‌گردونه؛
  // اینجا فقط هش و ذخیره‌ش می‌کنیم تا بعداً بتونیم با ورودی کاربر مقایسه کنیم
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_IN_SECONDS * 1000);

  await Otp.findOneAndUpdate(
    { phone },
    { codeHash, expiresAt, attempts: 0, lastSentAt: new Date() },
    { upsert: true },
  );

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

// پنل ادمین - حذف یک کاربر
export const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

// ویرایش پروفایل کاربر لاگین‌شده (فعلاً فقط نام؛ شماره موبایل تغییرناپذیره)
export const updateProfile = async (userId: string, data: { name: string }) => {
  const user = await User.findByIdAndUpdate(userId, { name: data.name }, { new: true });
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }
  return toPublicUser(user);
};

// دفترچه آدرس - لیست آدرس‌های کاربر لاگین‌شده
export const getAddresses = async (userId: string) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }
  return user.addresses;
};

// دفترچه آدرس - افزودن آدرس جدید
export const addAddress = async (userId: string, data: AddressInput) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }

  // اولین آدرس همیشه پیش‌فرضه؛ در غیر این صورت اگه کاربر صراحتاً
  // isDefault=true فرستاده باشه، بقیه‌ی آدرس‌ها از پیش‌فرض بودن خارج می‌شن
  const shouldBeDefault = user.addresses.length === 0 || Boolean(data.isDefault);
  if (shouldBeDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  user.addresses.push({ ...data, isDefault: shouldBeDefault } as IAddress);
  await user.save();
  return user.addresses;
};

// دفترچه آدرس - ویرایش یک آدرس
export const updateAddress = async (
  userId: string,
  addressId: string,
  data: Partial<AddressInput>,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }

  const target = user.addresses.id(addressId);
  if (!target) {
    throw new ApiError(404, "آدرس پیدا نشد");
  }

  if (data.isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  Object.assign(target, data);
  await user.save();
  return user.addresses;
};

// دفترچه آدرس - حذف یک آدرس
export const deleteAddress = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }

  const target = user.addresses.id(addressId);
  if (!target) {
    throw new ApiError(404, "آدرس پیدا نشد");
  }

  const wasDefault = target.isDefault;
  target.deleteOne();

  // اگه آدرس پیش‌فرض حذف شد، اولین آدرس باقی‌مونده (اگه بود) پیش‌فرض می‌شه
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return user.addresses;
};
