import axios from "axios";
import FormData from "form-data";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

interface GenerateRoomImageOptions {
  /** بافر عکس اتاق (خروجی multer memoryStorage) */
  roomImageBuffer: Buffer;
  /** mimetype عکس اتاق، برای فرم‌دیتای ارسالی به سرویس هوش مصنوعی */
  roomImageMimeType: string;
  /** آدرس عکس بافت/نمونه کاشی انتخابی (اختیاری) */
  tileImageUrl?: string;
  /** توضیح متنی برای مدل هوش مصنوعی */
  prompt: string;
}

/**
 * تنها نقطه‌ی تماس با سرویس بیرونی تولید/ویرایش تصویر با هوش مصنوعی.
 *
 * ⚠️ توجه مهم:
 * بدنه‌ی دقیق درخواست، مسیر endpoint و فرمت پاسخ به سرویس انتخابی بستگی دارد
 * (مثلاً gapgpt.app یا هر ارائه‌دهنده‌ی دیگری که مدل تصویر-به-تصویر ارائه می‌دهد).
 * پیاده‌سازی زیر یک اسکلت آماده و درست‌کار است؛ فقط کافی‌ست بعد از مطالعه‌ی
 * مستندات سرویس موردنظرت، مسیر endpoint و نام فیلدهای FormData را با مستندات آن تطبیق بدهی.
 *
 * env مورد نیاز (در فایل .env):
 *   AI_API_URL=آدرس پایه سرویس
 *   AI_API_KEY=کلید API
 */
export const generateRoomWithTile = async ({
  roomImageBuffer,
  roomImageMimeType,
  tileImageUrl,
  prompt,
}: GenerateRoomImageOptions): Promise<Buffer> => {
  if (!env.AI_API_URL || !env.AI_API_KEY) {
    throw new ApiError(
      500,
      "سرویس هوش مصنوعی تنظیم نشده است. لطفاً AI_API_URL و AI_API_KEY را در .env تنظیم کنید.",
    );
  }

  const form = new FormData();
  form.append("image", roomImageBuffer, {
    filename: `room.${roomImageMimeType === "image/png" ? "png" : "jpg"}`,
    contentType: roomImageMimeType,
  });
  form.append("prompt", prompt);
  if (tileImageUrl) {
    form.append("reference_image_url", tileImageUrl);
  }

  try {
    const response = await axios.post(`${env.AI_API_URL}/images/edits`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${env.AI_API_KEY}`,
      },
      responseType: "arraybuffer",
      timeout: 60_000,
    });

    return Buffer.from(response.data as ArrayBuffer);
  } catch (error) {
    console.log("AI provider error:", error);
    throw new ApiError(502, "خطا در ارتباط با سرویس هوش مصنوعی");
  }
};
