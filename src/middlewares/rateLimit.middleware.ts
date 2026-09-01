import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

// محدودکننده نرخ درخواست برای اندپوینت‌های حساس/پرهزینه
// مثل سرویس هوش مصنوعی در Room Visualizer.
const handler = (_req: Request, res: Response): void => {
  const error = new ApiError(
    429,
    "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید و دوباره تلاش کنید.",
  );

  res.status(error.statusCode).json({ success: false, message: error.message });
};

// محدودکننده Room Visualizer
// حداکثر ۱۰ درخواست در یک ساعت برای هر کاربر لاگین‌شده.
// اگر کاربر لاگین نباشد، محدودسازی بر اساس IP انجام می‌شود.
export const roomVisualizerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: Request): string =>
    req.user?._id?.toString() ?? ipKeyGenerator(req.ip ?? "unknown"),

  handler,
});

// محدودکننده فرم‌های عمومی بدون لاگین
// مثل ثبت نظر و تماس با ما.
// حداکثر ۱۰ درخواست در ۱۰ دقیقه برای هر IP.
export const publicFormRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
