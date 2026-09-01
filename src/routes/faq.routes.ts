import { Router } from "express";
import {
  getPublicFaqs,
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faq.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createFaqSchema, updateFaqSchema } from "../validations/faq.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Faq
 *   description: سوالات متداول
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: دریافت سوالات متداول فعال (عمومی)
 *     tags: [Faq]
 *     responses:
 *       200: { description: لیست سوالات متداول }
 */
router.get("/", getPublicFaqs);

/**
 * @swagger
 * /api/faqs/all:
 *   get:
 *     summary: دریافت همه‌ی سوالات متداول (ادمین)
 *     tags: [Faq]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل سوالات متداول }
 */
router.get("/all", protect, adminOnly, getAllFaqs);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: ساخت سوال متداول جدید (ادمین)
 *     tags: [Faq]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", protect, adminOnly, validate(createFaqSchema), createFaq);

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: ویرایش سوال متداول (ادمین)
 *     tags: [Faq]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", protect, adminOnly, validate(updateFaqSchema), updateFaq);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: حذف سوال متداول (ادمین)
 *     tags: [Faq]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", protect, adminOnly, deleteFaq);

export default router;
