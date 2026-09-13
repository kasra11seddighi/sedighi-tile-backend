import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { uploadAdminImage } from "../middlewares/adminUpload.middleware";
import { cleanupOrphanedUpload } from "../middlewares/upload.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: آپلود عکس از پنل ادمین (لوگوی برند، عکس محصول، عکس رنگ و...)
 */

/**
 * @swagger
 * /api/uploads/{folder}:
 *   post:
 *     summary: آپلود یک عکس در پوشه‌ی مشخص‌شده (فقط ادمین)
 *     tags: [Uploads]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema: { type: string, enum: [brands, products, colors, categories, projects, about] }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *     responses:
 *       201: { description: آپلود موفق، مسیر عمومی فایل برگردانده می‌شود }
 *       400: { description: فایل ارسال نشده یا نوع/حجم فایل نامعتبر است }
 */
router.post(
  "/:folder",
  uploadAdminImage.single("image"),
  cleanupOrphanedUpload,
  uploadImage,
);

export default router;
