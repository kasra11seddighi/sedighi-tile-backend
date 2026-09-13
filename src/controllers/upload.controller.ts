import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// پنل ادمین - آپلود یک عکس؛ فایل قبلاً توسط میان‌افزار multer روی دیسک
// (زیر public/uploads/<folder>) ذخیره شده؛ اینجا فقط مسیر عمومیِ قابل
// نمایش (که در آدرس‌دهی سایت/پنل استفاده می‌شه) رو برمی‌گردونیم.
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "فایلی ارسال نشده است");
  }

  const url = `/uploads/${req.params.folder}/${req.file.filename}`;

  res.status(201).json({ success: true, data: { url } });
});
