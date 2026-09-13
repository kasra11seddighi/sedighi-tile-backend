import axios from "axios";
import { env } from "../config/env";

/**
 * سرویس «OTP کنسول» ملی‌پیامک (console.melipayamak.com) — با توکن
 * اختصاصی پروژه، نه یوزرنیم/رمز پنل. برخلاف روش پترن روی خط اشتراکی،
 * این سرویس ظاهراً خودش کد تایید رو تولید و ارسال می‌کنه؛ یعنی کدی که
 * کاربر رو گوشیش می‌بینه، کدیه که ملی‌پیامک ساخته، نه کدی که ما تو
 * سرور خودمون ساختیم و ذخیره کردیم.
 *
 * ⚠️ به همین دلیل، این تابع هنوز به‌جای sendOtpSms اصلی استفاده نمی‌شه:
 * چون تا وقتی «متد تایید کد» (verify) طرف ملی‌پیامک رو هم نداشته باشیم،
 * راهی نیست که بفهمیم کدی که کاربر تایپ می‌کنه درسته یا نه — چون اون کد
 * پیش ما ذخیره نشده، پیش ملی‌پیامک ذخیره شده.
 *
 * تو پنل کنسول ملی‌پیامک، دقیقاً همون‌جایی که این قطعه‌کد «ارسال» رو
 * کپی کردی، معمولاً یه قطعه‌کد «تایید» (Verify) هم کنارش هست — اونو هم
 * بفرست تا verifyOtp رو هم به همین سرویس وصل کنم. تا اون موقع، جریان
 * فعلی (تولید کد در سرور خودمون + پترن روی خط اشتراکی) دست‌نخورده باقی
 * می‌مونه.
 */
export const sendMelipayamakConsoleOtp = async (phone: string): Promise<void> => {
  if (!env.MELIPAYAMAK_OTP_TOKEN) {
    console.log(`📱 [Melipayamak console OTP DEV MODE] ارسال به ${phone} (توکن ست نشده)`);
    return;
  }

  await axios.post(
    `https://console.melipayamak.com/api/send/otp/${env.MELIPAYAMAK_OTP_TOKEN}`,
    { to: phone },
    { headers: { "Content-Type": "application/json" }, timeout: 15_000 },
  );
};
