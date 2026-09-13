import { Router } from "express";
import {
  getProjectCategories,
  getProjectCategory,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} from "../controllers/projectCategory.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createProjectCategorySchema,
  updateProjectCategorySchema,
} from "../validations/projectCategory.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProjectCategories
 *   description: مدیریت دسته‌بندی‌های پروژه
 */

// توجه: لیست عمومی همین دسته‌بندی‌ها (برای فیلتر صفحه‌ی پروژه‌ها) از
// /api/projects/categories هم در دسترسه (بدون لاگین)؛ این مسیرها علاوه
// بر همون GET عمومی، ساخت/ویرایش/حذف از داشبورد ادمین رو هم می‌دن.

router.get("/", getProjectCategories);

router.get("/:id", getProjectCategory);

router.post(
  "/",
  validate(createProjectCategorySchema),
  createProjectCategory,
);

router.put(
  "/:id",
  validate(updateProjectCategorySchema),
  updateProjectCategory,
);

router.delete("/:id", deleteProjectCategory);

export default router;
