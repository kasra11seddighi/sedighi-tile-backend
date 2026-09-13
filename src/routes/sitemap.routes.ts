import { Router } from "express";
import { getSitemap } from "../controllers/sitemap.controller";

const router = Router();

/**
 * @swagger
 * /sitemap.xml:
 *   get:
 *     summary: تولید داینامیک Sitemap برای موتورهای جستجو
 *     tags: [Sitemap]
 *     responses:
 *       200: { description: فایل XML سایت‌مپ }
 */
router.get("/sitemap.xml", getSitemap);

export default router;
