import "dotenv/config";
import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().default(""),
);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),

  MONGO_URI: z
    .string()
    .trim()
    .min(1, "MONGO_URI الزامی است")
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGO_URI باید با mongodb:// یا mongodb+srv:// شروع شود",
    ),

  JWT_SECRET: z
    .string()
    .trim()
    .min(32, "JWT_SECRET باید حداقل 32 کاراکتر باشد"),

  JWT_EXPIRES_IN: z.string().trim().default("7d"),

  CLIENT_URL: z.string().trim().default("*"),

  AI_API_URL: optionalString,
  AI_API_KEY: optionalString,

  SMS_API_URL: optionalString,
  SMS_API_KEY: optionalString,
  SMS_SENDER_NUMBER: optionalString,

  OTP_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(120),

  OTP_RESEND_COOLDOWN_SECONDS: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(60),

  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  ZARINPAL_MERCHANT_ID: optionalString,
  ZARINPAL_CALLBACK_URL: optionalString,

  ZARINPAL_SANDBOX: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");

  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = parsed.data;
