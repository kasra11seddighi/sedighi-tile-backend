import axios from "axios";
import crypto from "crypto";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

// فقط برای حالت توسعه (وقتی توکن ملی‌پیامک ست نشده) - کد ۶ رقمی تصادفی
const generateLocalOtpCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * درخواست ارسال کد تایید (OTP) به یک شماره، از طریق سرویس «OTP کنسول»
 * ملی‌پیامک (console.melipayamak.com).
 *
 * طبق راهنمای رسمی ملی‌پیامک، این سرویس Verify اختصاصی نداره: خودِ
 * ملی‌پیامک کد رو تولید می‌کنه، پیامکش می‌کنه، و همون کد رو تو پاسخ
 * (فیلد `code`) به ما برمی‌گردونه. وظیفه‌ی نگه‌داری و تایید کد به عهده‌ی
 * خودمونه — دقیقاً همون کاری که services/auth.service.ts با خروجی این
 * تابع انجام می‌ده (هش می‌کنه، تو مدل Otp ذخیره می‌کنه، و بعداً با ورودی
 * کاربر مقایسه می‌کنه).
 *
 * env مورد نیاز (در فایل .env):
 *   MELIPAYAMAK_OTP_TOKEN=توکن اختصاصی سرویس OTP از پنل کنسول ملی‌پیامک
 *
 * اگه این مقدار ست نشده باشه (مثلاً روی سیستم توسعه)، به‌جای تماس با
 * ملی‌پیامک، یه کد تصادفی محلی تولید و تو کنسول لاگ می‌شه تا بدون نیاز
 * به پیامک واقعی هم بشه جریان OTP رو تست کرد.
 */
export const requestOtpCode = async (phone: string): Promise<string> => {
  if (!env.MELIPAYAMAK_OTP_TOKEN) {
    const code = generateLocalOtpCode();
    console.log(`📱 [SMS DEV MODE] کد تایید برای ${phone}: ${code}`);
    return code;
  }

  try {
    const res = await axios.post(
      `https://console.melipayamak.com/api/send/otp/${env.MELIPAYAMAK_OTP_TOKEN}`,
      { to: phone },
      { headers: { "Content-Type": "application/json" }, timeout: 15_000 },
    );

    const code = res.data?.code;
    if (!code) {
      throw new Error(`پاسخ نامعتبر از ملی‌پیامک (بدون code): ${JSON.stringify(res.data)}`);
    }

    return String(code);
  } catch (error) {
    // اگه ملی‌پیامک خودش یه پاسخ خطا برگردونده باشه (مثلاً توکن اشتباه،
    // اعتبار پیامک تموم‌شده، یا خودِ شماره مشکل داره)، دلیل واقعی رو تو
    // بدنه‌ی پاسخش می‌نویسه؛ پیام پیش‌فرض اکسیوس ("Request failed with
    // status code 400") این جزئیات رو نشون نمی‌ده، برای همین اینجا
    // صریح لاگش می‌کنیم تا تو کنسول سرور دلیل واقعی معلوم باشه.
    if (axios.isAxiosError(error)) {
      console.log("SMS provider error (Melipayamak):", {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.log("SMS provider error (Melipayamak):", error);
    }

    // به کاربر نهایی جزئیات فنی نشون نمی‌دیم؛ فقط تو لاگ سرور بالا قابل دیدنه
    throw new ApiError(502, "ارسال پیامک کد تایید با خطا مواجه شد؛ لطفاً چند لحظه دیگر دوباره امتحان کنید.");
  }
};
