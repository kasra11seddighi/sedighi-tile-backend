import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.string().default("production"),
  MONGO_URI: z.string().min(1, "MONGO_URI الزامی است"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET الزامی است"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("*"),

  AI_API_URL: z.string().default(""),
  AI_API_KEY: z.string().default(""),

  SMS_API_URL: z.string().default(""),
  SMS_API_KEY: z.string().default(""),
  SMS_SENDER_NUMBER: z.string().default(""),

  OTP_EXPIRES_IN_SECONDS: z.coerce.number().default(120),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),

  ZARINPAL_MERCHANT_ID: z.string().default(""),
  ZARINPAL_CALLBACK_URL: z.string().default(""),
  ZARINPAL_SANDBOX: z.coerce.boolean().default(true),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ متغیرهای محیطی نامعتبر هستند:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
