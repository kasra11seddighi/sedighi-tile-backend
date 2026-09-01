import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validations/category.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: مدیریت دسته‌بندی‌ها
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: دریافت همه‌ی دسته‌بندی‌ها
 *     tags: [Categories]
 *     responses:
 *       200: { description: لیست دسته‌بندی‌ها }
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: دریافت یک دسته‌بندی
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: دسته‌بندی پیدا شد }
 *       404: { description: یافت نشد }
 */
router.get("/:id", getCategory);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: ساخت دسته‌بندی جدید (ادمین)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", protect, adminOnly, validate(createCategorySchema), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: ویرایش دسته‌بندی (ادمین)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", protect, adminOnly, validate(updateCategorySchema), updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: حذف دسته‌بندی (ادمین)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
