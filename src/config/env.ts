import "dotenv/config";
import { z } from "zod";

// اعتبارسنجی متغیرهای محیطی هنگام بالا آمدن سرور.
// اگر یکی از این‌ها ست نشده باشد، سرور با خطای واضح متوقف می‌شود
// به‌جای این‌که وسط کار (مثلاً هنگام امضای JWT) با خطای مبهم کرش کند.
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URI: z.string().min(1, "MONGO_URI الزامی است"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET الزامی است"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("*"),

  // سرویس هوش مصنوعی برای Room Visualizer (اعمال کاشی روی عکس اتاق)
  // اختیاری هستند تا نبودشان سرور را از کار نیندازد؛ فقط هنگام فراخوانی واقعی endpoint چک می‌شوند.
  AI_API_URL: z.string().default(""),
  AI_API_KEY: z.string().default(""),

  // سرویس پیامک برای ارسال کد تایید (OTP) ورود/ثبت‌نام با شماره موبایل.
  // اختیاری هستند؛ در نبودشان، کد تایید در کنسول لاگ می‌شود (حالت توسعه).
  SMS_API_URL: z.string().default(""),
  SMS_API_KEY: z.string().default(""),
  SMS_SENDER_NUMBER: z.string().default(""),

  // مدت اعتبار کد تایید بر حسب ثانیه و حداقل فاصله‌ی بین دو ارسال
  OTP_EXPIRES_IN_SECONDS: z.coerce.number().default(120),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),

  // درگاه پرداخت آنلاین زرین‌پال. اختیاری هستند؛ تا وقتی MERCHANT_ID خالیه،
  // درگاه غیرفعال محسوب می‌شه و اندپوینت‌های پرداخت خطای واضح ۵۰۳ برمی‌گردونن
  // به‌جای کرش کردن یا صدا زدن API با merchant id خالی.
  ZARINPAL_MERCHANT_ID: z.string().default(""),
  ZARINPAL_CALLBACK_URL: z.string().default(""),
  ZARINPAL_SANDBOX: z.coerce.boolean().default(true),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ متغیرهای محیطی نامعتبر هستند:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
