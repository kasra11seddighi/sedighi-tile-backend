import { Router } from "express";
import {
  getBrands,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createBrandSchema, updateBrandSchema } from "../validations/brand.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: مدیریت برندها
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: دریافت برندهای فعال (عمومی)
 *     tags: [Brands]
 *     responses:
 *       200: { description: لیست برندهای فعال }
 */
router.get("/", getBrands);

/**
 * @swagger
 * /api/brands/all:
 *   get:
 *     summary: دریافت همه‌ی برندها (ادمین)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل برندها }
 */
router.get("/all", protect, adminOnly, getAllBrands);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: ساخت برند جدید (ادمین)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", protect, adminOnly, validate(createBrandSchema), createBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: ویرایش برند (ادمین)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", protect, adminOnly, validate(updateBrandSchema), updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: حذف برند (ادمین)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", protect, adminOnly, deleteBrand);

export default router;
