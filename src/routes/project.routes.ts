import { Router } from "express";
import {
  getProjects,
  getProject,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { getProjectCategories } from "../controllers/projectCategory.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsQuerySchema,
} from "../validations/project.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: مدیریت پروژه‌ها (نمونه‌کارها)
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: دریافت لیست پروژه‌ها (با جستجو، فیلتر و صفحه‌بندی)
 *     tags: [Projects]
 *     responses:
 *       200: { description: لیست پروژه‌ها }
 */
router.get("/", validate(getProjectsQuerySchema, "query"), getProjects);

/**
 * @swagger
 * /api/projects/all:
 *   get:
 *     summary: دریافت همه‌ی پروژه‌ها، فعال و غیرفعال (ادمین)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: لیست کامل پروژه‌ها }
 */
// این مسیر هم باید قبل از "/categories" و "/:id" ثبت بشه.
router.get("/all", protect, adminOnly, getAllProjectsAdmin);

/**
 * @swagger
 * /api/projects/categories:
 *   get:
 *     summary: دریافت دسته‌بندی‌های پروژه (برای فیلتر صفحه‌ی پروژه‌ها)
 *     tags: [Projects]
 *     responses:
 *       200: { description: لیست دسته‌بندی‌های پروژه }
 */
// توجه: این مسیر باید قبل از "/:id" ثبت بشه وگرنه اکسپرس "categories"
// رو به‌عنوان مقدار پارامتر id به getProject پاس می‌ده (دقیقاً همون نکته‌ای
// که توی product.routes.ts برای sort-options رعایت شده).
router.get("/categories", getProjectCategories);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: دریافت یک پروژه
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: پروژه پیدا شد }
 *       404: { description: یافت نشد }
 */
router.get("/:id", getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: ساخت پروژه جدید (ادمین)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: ساخته شد }
 */
router.post("/", protect, adminOnly, validate(createProjectSchema), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: ویرایش پروژه (ادمین)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: ویرایش شد }
 */
router.put("/:id", protect, adminOnly, validate(updateProjectSchema), updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: حذف پروژه (ادمین)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: حذف شد }
 */
router.delete("/:id", protect, adminOnly, deleteProject);

export default router;
