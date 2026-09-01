import fs from "fs";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

// عکس‌های اتاق کاربر قبل از ارسال به هوش مصنوعی اینجا ذخیره می‌شوند
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "rooms");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - هماهنگ با محدودیت فرانت

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `room-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new ApiError(400, "فقط فایل JPG یا PNG قابل قبول است"));
    return;
  }
  cb(null, true);
}

export const uploadRoomImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * اگه بعد از آپلود موفقِ فایل (multer)، یکی از میان‌افزارهای بعدی (مثلاً
 * validate) خطا بده، فایل روی دیسک ذخیره شده ولی هیچ‌وقت به کنترلر
 * نمی‌رسه که پاکش کنه. این میان‌افزارِ خطا، قبل از رد کردن خطا به
 * errorHandler مرکزی، فایل یتیم‌شده رو حذف می‌کنه.
 */
export const cleanupOrphanedUpload = (
  err: unknown,
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error("خطا در حذف فایل یتیم‌شده:", unlinkErr.message);
      }
    });
  }
  next(err);
};
