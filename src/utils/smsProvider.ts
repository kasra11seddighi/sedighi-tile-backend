import axios from "axios";
import { env } from "../config/env";

/**
 * تنها نقطه‌ی تماس با سرویس بیرونی ارسال پیامک برای کد تایید (OTP).
 *
 * ⚠️ توجه مهم:
 * بدنه‌ی دقیق درخواست، مسیر endpoint و فرمت پاسخ به سرویس پیامکی انتخابی
 * بستگی دارد (مثلاً کاوه‌نگار، ملی‌پیامک، فراز اس‌ام‌اس و ...).
 * پیاده‌سازی زیر یک اسکلت آماده است؛ کافی‌ست بعد از مطالعه‌ی مستندات سرویس
 * موردنظرت، مسیر endpoint و بدنه‌ی درخواست را با مستندات آن تطبیق بدهی.
 *
 * env مورد نیاز (در فایل .env):
 *   SMS_API_URL=آدرس پایه سرویس پیامکی
 *   SMS_API_KEY=کلید API
 *   SMS_SENDER_NUMBER=شماره خط ارسال‌کننده (اختیاری، بسته به سرویس)
 *
 * اگر این متغیرها تنظیم نشده باشند (مثلاً در محیط توسعه)، به‌جای خطا دادن،
 * کد تایید در کنسول لاگ می‌شود تا توسعه‌دهنده بدون نیاز به سرویس واقعی پیامک
 * بتواند جریان OTP را تست کند.
 */
export const sendOtpSms = async (phone: string, code: string): Promise<void> => {
  if (!env.SMS_API_URL || !env.SMS_API_KEY) {
    console.log(`📱 [SMS DEV MODE] کد تایید برای ${phone}: ${code}`);
    return;
  }

  try {
    await axios.post(
      env.SMS_API_URL,
      {
        receptor: phone,
        sender: env.SMS_SENDER_NUMBER || undefined,
        message: `کد تایید شما: ${code}`,
      },
      {
        headers: { Authorization: `Bearer ${env.SMS_API_KEY}` },
        timeout: 15_000,
      },
    );
  } catch (error) {
    console.log("SMS provider error:", error);
    // خطای ارسال پیامک را به بالا پرتاب نمی‌کنیم که کاربر بی‌دلیل بلاک نشود؛
    // اما در محیط production حتماً باید این خطا لاگ/مانیتور شود.
    throw error;
  }
};
