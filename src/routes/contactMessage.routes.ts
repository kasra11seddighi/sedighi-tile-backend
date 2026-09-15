import { Router } from "express";
import {
  createMessage,
  getMessages,
  markAsRead,
} from "../controllers/contactMessage.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { publicFormRateLimit } from "../middlewares/rateLimit.middleware";
import { createContactMessageSchema } from "../validations/contactMessage.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ContactMessages
 *   description: پیام‌های ارسالی کاربران از فرم تماس با ما
 */

/**
 * @swagger
 * /api/contact-messages:
 *   post:
 *     summary: ارسال پیام از فرم تماس با ما
 *     tags: [ContactMessages]
 *     responses:
 *       201: { description: پیام ثبت شد }
 *       400: { description: ورودی نامعتبر }
 */
router.post("/", publicFormRateLimit, validate(createContactMessageSchema), createMessage);

// از این‌جا به بعد فقط ادمین
router.use(protect, adminOnly);

/**
 * @swagger
 * /api/contact-messages:
 *   get:
 *     summary: دریافت لیست پیام‌ها (ادمین)
 *     tags: [ContactMessages]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست پیام‌ها }
 */
router.get("/", getMessages);

/**
 * @swagger
 * /api/contact-messages/{id}/read:
 *   patch:
 *     summary: علامت‌گذاری پیام به‌عنوان خوانده‌شده (ادمین)
 *     tags: [ContactMessages]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: به‌روزرسانی شد }
 *       404: { description: پیام یافت نشد }
 */
router.patch("/:id/read", markAsRead);

export default router;
