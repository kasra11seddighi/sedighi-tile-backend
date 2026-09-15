import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - هماهنگ با محدودیت فرانت

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new ApiError(400, "فقط فایل JPG یا PNG قابل قبول است"));
    return;
  }
  cb(null, true);
}

// عکس اتاق کاربر دیگه روی دیسک سرور ذخیره نمی‌شه (فایل‌سیستم اپ روی
// لیارا ephemeral هست و با هر ری‌دیپلوی/ری‌استارت پاک می‌شه - دقیقاً
// همون دلیلی که آپلود پنل ادمین رو به Liara Object Storage منتقل کردیم).
// فایل به‌صورت buffer تو حافظه نگه داشته می‌شه؛ کنترلر همون buffer رو
// مستقیم برای سرویس هوش مصنوعی می‌فرسته و نتیجه‌ی نهایی رو هم به همون
// باکت Liara آپلود می‌کنه (roomVisualizer.service.ts).
export const uploadRoomImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
