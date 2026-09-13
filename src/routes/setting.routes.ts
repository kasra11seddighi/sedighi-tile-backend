import { Router } from "express";
import { getHeader, getFooter, updateSetting } from "../controllers/setting.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateSettingSchema } from "../validations/setting.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: تنظیمات کلی سایت (هدر و فوتر)
 */

/**
 * @swagger
 * /api/settings/header:
 *   get:
 *     summary: دریافت اطلاعات هدر (عمومی)
 *     tags: [Settings]
 *     responses:
 *       200: { description: اطلاعات هدر }
 */
router.get("/header", getHeader);

/**
 * @swagger
 * /api/settings/footer:
 *   get:
 *     summary: دریافت اطلاعات فوتر (عمومی)
 *     tags: [Settings]
 *     responses:
 *       200: { description: اطلاعات فوتر }
 */
router.get("/footer", getFooter);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: ویرایش تنظیمات سایت - لوگو، منو، لینک‌ها، شبکه‌های اجتماعی، تماس (ادمین)
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/", validate(updateSettingSchema), updateSetting);

export default router;
