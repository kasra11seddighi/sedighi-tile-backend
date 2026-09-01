import axios from "axios";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

/**
 * درگاه پرداخت آنلاین زرین‌پال.
 *
 * ⚠️ توجه مهم:
 * فعلاً ZARINPAL_MERCHANT_ID در محیط تنظیم نشده، پس این درگاه عمداً غیرفعاله.
 * هر دو تابع زیر همین الان اگه merchant id خالی باشه یک ApiError(503) با پیام
 * فارسی روشن پرتاب می‌کنن (نه کرش، نه خطای مبهم از سمت زرین‌پال).
 * وقتی merchant id واقعی رو توی .env گذاشتی (ZARINPAL_MERCHANT_ID و
 * ZARINPAL_CALLBACK_URL)، درگاه بدون هیچ تغییر دیگه‌ای فعال می‌شه.
 *
 * مستندات: https://www.zarinpal.com/docs/paymentGateway/
 */

const ZARINPAL_BASE = "https://payment.zarinpal.com/pg/v4/payment";
const ZARINPAL_SANDBOX_BASE = "https://sandbox.zarinpal.com/pg/v4/payment";
const ZARINPAL_STARTPAY = "https://payment.zarinpal.com/pg/StartPay";
const ZARINPAL_SANDBOX_STARTPAY = "https://sandbox.zarinpal.com/pg/StartPay";

function assertConfigured() {
  if (!env.ZARINPAL_MERCHANT_ID || !env.ZARINPAL_CALLBACK_URL) {
    throw new ApiError(
      503,
      "درگاه پرداخت آنلاین هنوز فعال نشده است. لطفاً از «پرداخت در محل» استفاده کنید.",
    );
  }
}

function apiBase() {
  return env.ZARINPAL_SANDBOX ? ZARINPAL_SANDBOX_BASE : ZARINPAL_BASE;
}

function startPayBase() {
  return env.ZARINPAL_SANDBOX ? ZARINPAL_SANDBOX_STARTPAY : ZARINPAL_STARTPAY;
}

interface RequestPaymentResult {
  authority: string;
  paymentUrl: string;
}

/** مرحله‌ی اول: درخواست ساخت تراکنش و گرفتن آدرس ریدایرکت به درگاه */
export const requestPayment = async (
  amountToman: number,
  description: string,
  orderId: string,
): Promise<RequestPaymentResult> => {
  assertConfigured();

  try {
    const response = await axios.post(`${apiBase()}/request.json`, {
      merchant_id: env.ZARINPAL_MERCHANT_ID,
      // زرین‌پال مبلغ رو به ریال می‌گیره
      amount: amountToman * 10,
      description,
      callback_url: `${env.ZARINPAL_CALLBACK_URL}?orderId=${orderId}`,
    });

    const data = response.data?.data;
    if (!data?.authority) {
      throw new ApiError(502, "درخواست پرداخت با خطا مواجه شد.");
    }

    return {
      authority: data.authority,
      paymentUrl: `${startPayBase()}/${data.authority}`,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, "ارتباط با درگاه پرداخت برقرار نشد.");
  }
};

interface VerifyPaymentResult {
  isSuccessful: boolean;
  refId?: string;
}

/** مرحله‌ی دوم: بعد از برگشت از درگاه، تراکنش رو verify می‌کنیم */
export const verifyPayment = async (
  authority: string,
  amountToman: number,
): Promise<VerifyPaymentResult> => {
  assertConfigured();

  try {
    const response = await axios.post(`${apiBase()}/verify.json`, {
      merchant_id: env.ZARINPAL_MERCHANT_ID,
      amount: amountToman * 10,
      authority,
    });

    const data = response.data?.data;
    const isSuccessful = data?.code === 100 || data?.code === 101;

    return { isSuccessful, refId: data?.ref_id?.toString() };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, "ارتباط با درگاه پرداخت برقرار نشد.");
  }
};
