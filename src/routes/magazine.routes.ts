import { Router } from "express";
import {
  getMagazines,
  getMagazineBySlug,
  getAllMagazines,
  createMagazine,
  updateMagazine,
  deleteMagazine,
} from "../controllers/magazine.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createMagazineSchema,
  updateMagazineSchema,
} from "../validations/magazine.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Magazine
 *   description: مجله‌ی آموزشی (مقالات کاشی، سرامیک و شیرآلات)
 */

/**
 * @swagger
 * /api/magazine:
 *   get:
 *     summary: دریافت مقاله‌های منتشرشده (عمومی)
 *     tags: [Magazine]
 *     responses:
 *       200: { description: لیست مقاله‌ها }
 */
router.get("/", getMagazines);

/**
 * @swagger
 * /api/magazine/all:
 *   get:
 *     summary: دریافت همه‌ی مقاله‌ها شامل پیش‌نویس (ادمین)
 *     tags: [Magazine]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل مقاله‌ها }
 */
router.get("/all", protect, adminOnly, getAllMagazines);

/**
 * @swagger
 * /api/magazine/{slug}:
 *   get:
 *     summary: دریافت یک مقاله با اسلاگ (عمومی)
 *     tags: [Magazine]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: مقاله }
 *       404: { description: یافت نشد }
 */
router.get("/:slug", getMagazineBySlug);

// از این‌جا به بعد فقط ادمین
router.use(protect, adminOnly);

/**
 * @swagger
 * /api/magazine:
 *   post:
 *     summary: ساخت مقاله‌ی جدید (ادمین)
 *     tags: [Magazine]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", validate(createMagazineSchema), createMagazine);

/**
 * @swagger
 * /api/magazine/{id}:
 *   put:
 *     summary: ویرایش مقاله (ادمین)
 *     tags: [Magazine]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", validate(updateMagazineSchema), updateMagazine);

/**
 * @swagger
 * /api/magazine/{id}:
 *   delete:
 *     summary: حذف مقاله (ادمین)
 *     tags: [Magazine]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", deleteMagazine);

export default router;
