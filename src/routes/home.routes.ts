import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { getHome, updateHome } from "../controllers/home.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateHomeSchema } from "../validations/home.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: محتوای صفحه اصلی (هیرو)
 */

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: دریافت محتوای صفحه اصلی (عمومی)
 *     tags: [Home]
 *     responses:
 *       200: { description: محتوای صفحه اصلی }
 *       404: { description: هنوز ساخته نشده }
 */
router.get("/", getHome);

/**
 * @swagger
 * /api/home:
 *   put:
 *     summary: ویرایش محتوای صفحه اصلی (ادمین)
 *     tags: [Home]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: ویرایش شد }
 */
// از این‌جا به بعد فقط ادمین (نیازمند لاگین و نقش admin)
router.use(protect, adminOnly);

router.put("/", validate(updateHomeSchema), updateHome);

export default router;
