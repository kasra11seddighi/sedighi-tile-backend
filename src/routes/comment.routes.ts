import { Router } from "express";
import {
  createComment,
  getCommentsByProduct,
  getAllComments,
  approveComment,
  replyToComment,
  deleteComment,
} from "../controllers/comment.controller";
import { validate } from "../middlewares/validate.middleware";
import { publicFormRateLimit } from "../middlewares/rateLimit.middleware";
import {
  createCommentSchema,
  getCommentsQuerySchema,
  replyCommentSchema,
} from "../validations/comment.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: نظرات کاربران روی محصولات
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: ثبت نظر جدید برای یک محصول (عمومی)
 *     tags: [Comments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product, name, text]
 *             properties:
 *               product: { type: string, description: "شناسه محصول" }
 *               name: { type: string }
 *               email: { type: string }
 *               text: { type: string }
 *               rating: { type: number }
 *     responses:
 *       201: { description: نظر ثبت شد (در انتظار تایید ادمین) }
 *       400: { description: ورودی نامعتبر }
 */
router.post(
  "/",
  publicFormRateLimit,
  validate(createCommentSchema),
  createComment,
);

/**
 * @swagger
 * /api/comments/product/{productId}:
 *   get:
 *     summary: دریافت نظرات تاییدشده‌ی یک محصول خاص (عمومی)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: لیست نظرات تاییدشده }
 */
router.get("/product/:productId", getCommentsByProduct);

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: دریافت همه‌ی نظرات با امکان فیلتر بر اساس محصول/وضعیت (ادمین)
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: product
 *         schema: { type: string }
 *       - in: query
 *         name: isApproved
 *         schema: { type: string, enum: ["true", "false"] }
 *     responses:
 *       200: { description: لیست نظرات + صفحه‌بندی }
 */
router.get(
  "/",
  validate(getCommentsQuerySchema, "query"),
  getAllComments,
);

/**
 * @swagger
 * /api/comments/{id}/approve:
 *   patch:
 *     summary: تایید یا رد یک نظر (ادمین)
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: وضعیت نظر به‌روزرسانی شد }
 *       404: { description: نظر یافت نشد }
 */
router.patch("/:id/approve", approveComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: حذف یک نظر (ادمین)
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 *       404: { description: نظر یافت نشد }
 */
/**
 * @swagger
 * /api/comments/{id}/reply:
 *   patch:
 *     summary: پاسخ ادمین به نظر
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reply]
 *             properties:
 *               reply: { type: string, description: "پاسخ ادمین؛ خالی کردن آن پاسخ را پاک می‌کند" }
 *     responses:
 *       200: { description: پاسخ ذخیره شد }
 *       404: { description: نظر یافت نشد }
 */
router.patch(
  "/:id/reply",
  validate(replyCommentSchema),
  replyToComment,
);

router.delete("/:id", deleteComment);

export default router;
