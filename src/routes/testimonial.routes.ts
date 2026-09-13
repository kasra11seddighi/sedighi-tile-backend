import { Router } from "express";
import {
  getPublicTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  getTestimonialsQuerySchema,
} from "../validations/testimonial.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: نظرات مشتری‌ها
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: دریافت نظرات فعال مشتری‌ها (عمومی)
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: لیست نظرات مشتری‌ها }
 */
router.get("/", validate(getTestimonialsQuerySchema, "query"), getPublicTestimonials);

/**
 * @swagger
 * /api/testimonials/all:
 *   get:
 *     summary: دریافت همه‌ی نظرات مشتری‌ها (ادمین)
 *     tags: [Testimonials]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل نظرات مشتری‌ها }
 */
// این مسیر باید قبل از "/:id" ثبت بشه — دقیقاً همون نکته‌ای که توی
// project.routes.ts برای "/all" و "/categories" رعایت شده.
router.get("/all", getAllTestimonials);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: ثبت نظر مشتری جدید (ادمین)
 *     tags: [Testimonials]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post(
  "/",
  validate(createTestimonialSchema),
  createTestimonial,
);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: ویرایش نظر مشتری (ادمین)
 *     tags: [Testimonials]
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
  validate(updateTestimonialSchema),
  updateTestimonial,
);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: حذف نظر مشتری (ادمین)
 *     tags: [Testimonials]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", deleteTestimonial);

export default router;
