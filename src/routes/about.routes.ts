import { Router } from "express";
import { getAbout, updateAbout } from "../controllers/about.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateAboutSchema } from "../validations/about.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: About
 *   description: محتوای صفحه «درباره ما»
 */

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: دریافت محتوای صفحه درباره ما (عمومی)
 *     tags: [About]
 *     responses:
 *       200: { description: محتوای صفحه درباره ما }
 */
router.get("/", getAbout);

/**
 * @swagger
 * /api/about:
 *   put:
 *     summary: ویرایش محتوای صفحه درباره ما (ادمین)
 *     tags: [About]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/", validate(updateAboutSchema), updateAbout);

export default router;
