import { Router } from "express";
import * as roomVisualizerController from "../controllers/roomVisualizer.controller";
import { validate } from "../middlewares/validate.middleware";
import { applyTileSchema } from "../validations/roomVisualizer.validation";
import { uploadRoomImage } from "../middlewares/upload.middleware";
import { protect } from "../middlewares/auth.middleware";
import { roomVisualizerRateLimit } from "../middlewares/rateLimit.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RoomVisualizer
 *   description: اعمال کاشی روی عکس اتاق با هوش مصنوعی
 */

/**
 * @swagger
 * /api/room-visualizer/suggest:
 *   get:
 *     summary: دریافت پیشنهاد کاشی از هوش مصنوعی
 *     tags: [RoomVisualizer]
 *     responses:
 *       200: { description: کاشی پیشنهادی برگردانده شد }
 *       404: { description: محصولی برای پیشنهاد پیدا نشد }
 */
router.get("/suggest", roomVisualizerController.suggestTile);

/**
 * @swagger
 * /api/room-visualizer/apply:
 *   post:
 *     summary: اعمال کاشی روی عکس اتاق کاربر
 *     tags: [RoomVisualizer]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image, tileId]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               tileId:
 *                 type: string
 *     responses:
 *       200: { description: آدرس تصویر نهایی برگردانده شد }
 *       400: { description: ورودی نامعتبر یا فایل ارسال نشده }
 *       401: { description: دسترسی غیرمجاز. باید لاگین باشید }
 *       404: { description: کاشی انتخاب‌شده یافت نشد }
 *       429: { description: تعداد درخواست‌ها بیش از حد مجاز است }
 */
// نکته: این اندپوینت یک سرویس هوش مصنوعی پولی بیرونی رو صدا می‌زنه؛
// برای جلوگیری از سوءاستفاده و مصرف بی‌رویه‌ی بودجه، هم نیاز به لاگین داره
// و هم rate limit روش هست.
router.post(
  "/apply",
  protect,
  roomVisualizerRateLimit,
  uploadRoomImage.single("image"),
  validate(applyTileSchema),
  roomVisualizerController.applyTile,
);

export default router;
