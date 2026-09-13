import rateLimit from "express-rate-limit";
import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  logout,
  getMe,
  getUsers,
  deleteUser,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
  updateProfileSchema,
  addressSchema,
  updateAddressSchema,
} from "../validations/auth.validation";

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
 * /api/auth/logout:
 *   post:
 *     summary: خروج از حساب کاربری (پاک‌کردن کوکی توکن)
 *     tags: [Auth]
 *     responses:
 *       200: { description: خروج موفق }
 */
router.post("/logout", logout);

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
 * /api/auth/me:
 *   patch:
 *     summary: ویرایش پروفایل کاربر لاگین‌شده (فقط نام)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: پروفایل ویرایش شد }
 */
router.patch("/me", protect, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/auth/me/addresses:
 *   get:
 *     summary: دریافت دفترچه آدرس کاربر لاگین‌شده
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست آدرس‌ها }
 *   post:
 *     summary: افزودن آدرس جدید به دفترچه آدرس
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: آدرس اضافه شد }
 */
router.get("/me/addresses", protect, getAddresses);
router.post("/me/addresses", protect, validate(addressSchema), addAddress);

/**
 * @swagger
 * /api/auth/me/addresses/{addressId}:
 *   put:
 *     summary: ویرایش یک آدرس
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: آدرس ویرایش شد }
 *   delete:
 *     summary: حذف یک آدرس
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: آدرس حذف شد }
 */
router.put(
  "/me/addresses/:addressId",
  protect,
  validate(updateAddressSchema),
  updateAddress,
);
router.delete("/me/addresses/:addressId", protect, deleteAddress);

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
router.get("/users", getUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: حذف یک کاربر (ادمین)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: کاربر حذف شد }
 *       400: { description: تلاش برای حذف حساب خود ادمین }
 *       404: { description: کاربر پیدا نشد }
 */
router.delete("/users/:id", deleteUser);

export default router;
