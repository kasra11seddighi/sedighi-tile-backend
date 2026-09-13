import { Router } from "express";
import {
  getPublicYardBanners,
  getAllYardBanners,
  createYardBanner,
  updateYardBanner,
  deleteYardBanner,
} from "../controllers/yardBanner.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createYardBannerSchema,
  updateYardBannerSchema,
  getYardBannersQuerySchema,
} from "../validations/yardBanner.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: YardBanners
 *   description: بنرهای بخش «بیرون از خانه» (استخر، حیاط‌سازی، نما) در صفحه اصلی
 */

/**
 * @swagger
 * /api/yard-banners:
 *   get:
 *     summary: دریافت بنرهای فعالِ بخش بیرون از خانه (عمومی)
 *     tags: [YardBanners]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: لیست بنرها }
 */
router.get("/", validate(getYardBannersQuerySchema, "query"), getPublicYardBanners);

/**
 * @swagger
 * /api/yard-banners/all:
 *   get:
 *     summary: دریافت همه‌ی بنرها (ادمین)
 *     tags: [YardBanners]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل بنرها }
 */
// این مسیر باید قبل از "/:id" ثبت بشه (مثل الگوی testimonial/project)
router.get("/all", getAllYardBanners);

/**
 * @swagger
 * /api/yard-banners:
 *   post:
 *     summary: ساخت بنر جدید (ادمین)
 *     tags: [YardBanners]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post(
  "/",
  validate(createYardBannerSchema),
  createYardBanner,
);

/**
 * @swagger
 * /api/yard-banners/{id}:
 *   put:
 *     summary: ویرایش بنر (ادمین)
 *     tags: [YardBanners]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put(
  "/:id",
  validate(updateYardBannerSchema),
  updateYardBanner,
);

/**
 * @swagger
 * /api/yard-banners/{id}:
 *   delete:
 *     summary: حذف بنر (ادمین)
 *     tags: [YardBanners]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", deleteYardBanner);

export default router;
