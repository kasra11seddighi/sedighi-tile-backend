import fs from "fs";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";

// پوشه‌های مجاز برای آپلود عکس از پنل ادمین. هر بخش (برند/محصول/رنگ و...)
// عکس‌هاش رو زیر همین زیرپوشه‌ها ذخیره می‌کنه تا مسیرها منظم و قابل پیش‌بینی
// بمونن. اسم پوشه از خودِ URL (پارامتر :folder) میاد، برای همین با یه
// لیست سفید محدودش می‌کنیم تا کسی نتونه با یه اسم عجیب مسیر دلخواه بسازه.
const ALLOWED_FOLDERS = [
  "brands",
  "products",
  "colors",
  "categories",
  "projects",
  "about",
  "magazine",
  "home",
  "logo",
  "yard",
];

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function resolveUploadDir(folder: string) {
  return path.join(process.cwd(), "public", "uploads", folder);
}

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const folder = req.params.folder;

    if (!ALLOWED_FOLDERS.includes(folder)) {
      cb(new ApiError(400, "پوشه‌ی آپلود نامعتبر است"), "");
      return;
    }

    const dir = resolveUploadDir(folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new ApiError(400, "فقط فایل JPG، PNG یا WEBP قابل قبول است"));
    return;
  }
  cb(null, true);
}

export const uploadAdminImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export { ALLOWED_FOLDERS };
