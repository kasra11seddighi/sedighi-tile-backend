import { Router } from "express";
import * as ctrl from "../controllers/productSortOption.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createSortOptionSchema,
  updateSortOptionSchema,
} from "../validations/productSortOption.validation";

const router = Router();

// کل این روتر مخصوص پنل ادمینه
router.use(protect, adminOnly);

/**
 * @swagger
 * tags:
 *   name: ProductSortOptions
 *   description: مدیریت گزینه‌های مرتب‌سازی محصولات (ادمین)
 */

// توجه: لیست عمومی همین گزینه‌ها (برای فیلتر صفحه‌ی محصولات) از
// /api/products/sort-options می‌آید و بدون لاگین در دسترسه؛ این مسیرها
// فقط برای مدیریت (لیست کامل + ساخت/ویرایش/حذف) از داشبورد ادمینه.

router.get("/", ctrl.getSortOptionsAdmin);

router.post(
  "/",
  validate(createSortOptionSchema),
  ctrl.createSortOption,
);

router.put(
  "/:id",
  validate(updateSortOptionSchema),
  ctrl.updateSortOption,
);

router.delete("/:id", ctrl.deleteSortOption);

export default router;
