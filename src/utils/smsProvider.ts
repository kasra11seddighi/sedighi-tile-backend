import axios from "axios";
import { env } from "../config/env";

/**
 * ارسال پیامک کد تایید (OTP) از طریق ملی‌پیامک، با روش «پترن روی خط
 * اشتراکی» (Base Service Number) — همون روشی که خود ملی‌پیامک برای کد
 * تایید توصیه می‌کنه، چون نیازی به خرید خط اختصاصی نداره و پیامک‌های
 * OTP رو حتی برای شماره‌های مسدودشده‌ی مخابرات هم می‌فرسته.
 *
 * قبل از استفاده، این مراحل رو تو پنل ملی‌پیامک انجام بده:
 *   ۱. وارد پنل شو → بخش «پترن‌ها» (یا «سرویس ارسال با کد فعال‌سازی / OTP»)
 *   ۲. یه پترن جدید بساز، مثلاً: «کد تایید شما در نمایندگی صدیقی: %code%»
 *      (جای پارامتر متغیر رو با {0} یا مشابهش که خود پنل مشخص می‌کنه بذار)
 *   ۳. پترن رو ثبت کن؛ معمولاً چند دقیقه بعد تایید می‌شه و یه عدد به اسم
 *      «کد بدنه» یا Body Id بهت می‌ده — همون رو تو env زیر بذار.
 *
 * سه متغیر محیطی مورد نیاز (در فایل .env):
 *   MELIPAYAMAK_USERNAME=همون شماره موبایل یا یوزرنیم پنلت
 *   MELIPAYAMAK_PASSWORD=رمز پنلت
 *   MELIPAYAMAK_BODY_ID=همون کد بدنه‌ی پترن تاییدشده
 *
 * اگه این سه مقدار ست نشده باشن (مثلاً روی سیستم توسعه)، به‌جای خطا دادن،
 * کد تایید فقط تو کنسول لاگ می‌شه تا بدون نیاز به پیامک واقعی هم بشه
 * جریان OTP رو تست کرد.
 */
export const sendOtpSms = async (phone: string, code: string): Promise<void> => {
  if (!env.MELIPAYAMAK_USERNAME || !env.MELIPAYAMAK_PASSWORD || !env.MELIPAYAMAK_BODY_ID) {
    console.log(`📱 [SMS DEV MODE] کد تایید برای ${phone}: ${code}`);
    return;
  }

  try {
    const res = await axios.post(
      "https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber",
      new URLSearchParams({
        username: env.MELIPAYAMAK_USERNAME,
        password: env.MELIPAYAMAK_PASSWORD,
        to: phone,
        // مقداری که جای {0} تو متن پترن تاییدشده می‌شینه؛ اگه پترنت چند
        // پارامتری بود (مثلاً {0} و {1})، اینجا با ; از هم جداشون کن
        text: code,
        bodyId: env.MELIPAYAMAK_BODY_ID,
      }),
      { timeout: 15_000 },
    );

    // ملی‌پیامک همیشه HTTP 200 برمی‌گردونه؛ نتیجه‌ی واقعی تو بدنه‌ست:
    // یه عدد مثبت (RecId) یعنی موفق، عدد منفی یا صفر یعنی خطا
    const result = Number(res.data);
    if (!Number.isFinite(result) || result <= 0) {
      throw new Error(`پاسخ نامعتبر از ملی‌پیامک: ${res.data}`);
    }
  } catch (error) {
    console.log("SMS provider error (Melipayamak):", error);
    // خطای ارسال پیامک رو به بالا پرتاب نمی‌کنیم که کاربر بی‌دلیل بلاک نشه؛
    // اما در محیط production حتماً باید این خطا لاگ/مانیتور بشه.
    throw error;
  }
};
