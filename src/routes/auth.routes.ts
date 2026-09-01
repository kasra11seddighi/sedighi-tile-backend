import rateLimit from "express-rate-limit";
import { Router } from "express";
import { sendOtp, verifyOtp, getMe, getUsers } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { sendOtpSchema, verifyOtpSchema } from "../validations/auth.validation";

const router = Router();

// cooldown سرویس OTP فقط بر اساس شماره موبایله؛ بدون این محدودیتِ اضافه‌ی
// بر اساس IP، یه نفر می‌تونه با چرخوندن شماره‌های مختلف، هزینه‌ی پیامک رو
// نامحدود بالا ببره یا اسپم کنه.
const sendOtpIpRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // ۱۰ دقیقه
  max: 15, // حداکثر ۱۵ درخواست ارسال کد از هر IP
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: احراز هویت با شماره موبایل (کد تایید پیامکی)
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: ارسال کد تایید به شماره موبایل (برای ورود یا ثبت‌نام)
 *     tags: [Auth]
 *     responses:
 *       200: { description: کد تایید ارسال شد }
 *       400: { description: شماره موبایل نامعتبر است }
 *       429: { description: باید کمی صبر کنید و دوباره درخواست دهید }
 */
router.post("/send-otp", sendOtpIpRateLimit, validate(sendOtpSchema), sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: بررسی کد تایید و ورود/ثبت‌نام نهایی کاربر
 *     tags: [Auth]
 *     responses:
 *       200: { description: ورود یا ثبت‌نام موفق }
 *       400: { description: کد تایید اشتباه، منقضی‌شده یا نام کاربر جدید ارسال نشده }
 *       429: { description: تعداد تلاش‌های مجاز تمام شده است }
 */
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: دریافت اطلاعات کاربر لاگین‌شده
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: اطلاعات کاربر }
 *       401: { description: توکن نامعتبر است }
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: دریافت لیست کاربران ثبت‌نامی (ادمین)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کاربران }
 */
router.get("/users", protect, adminOnly, getUsers);

export default router;
