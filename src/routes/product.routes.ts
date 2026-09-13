import { Router } from "express";
import {
  getProducts,
  getProduct,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { getSortOptions } from "../controllers/productSortOption.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from "../validations/product.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: مدیریت محصولات
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: دریافت لیست محصولات (با جستجو، فیلتر و صفحه‌بندی)
 *     tags: [Products]
 *     responses:
 *       200: { description: لیست محصولات }
 */
router.get("/", validate(getProductsQuerySchema, "query"), getProducts);

/**
 * @swagger
 * /api/products/sort-options:
 *   get:
 *     summary: دریافت گزینه‌های فعال مرتب‌سازی محصولات
 *     tags: [Products]
 *     responses:
 *       200: { description: لیست گزینه‌های مرتب‌سازی }
 */
// توجه: این مسیر باید قبل از "/:id" ثبت بشه وگرنه اکسپرس "sort-options"
// رو به‌عنوان مقدار پارامتر id به getProduct پاس می‌ده.
router.get("/sort-options", getSortOptions);

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: دریافت همه‌ی محصولات، فعال و غیرفعال (ادمین)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل محصولات }
 */
// این مسیر هم باید قبل از "/:id" ثبت بشه، عیناً به همون دلیل sort-options.
router.get("/all", getAllProductsAdmin);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: دریافت یک محصول
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: محصول پیدا شد }
 *       404: { description: یافت نشد }
 */
router.get("/:id", getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: ساخت محصول جدید (ادمین)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", validate(createProductSchema), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: ویرایش محصول (ادمین)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", validate(updateProductSchema), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: حذف محصول (ادمین)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", deleteProduct);

export default router;
