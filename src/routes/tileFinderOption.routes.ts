import { Router } from "express";
import * as ctrl from "../controllers/tileFinderOption.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createOptionSchema,
  updateOptionSchema,
  createColorOptionSchema,
  updateColorOptionSchema,
} from "../validations/tileFinderOption.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TileFinderOptions
 *   description: مدیریت گزینه‌های کاشی‌یاب (فضا، سایز، سبک، رنگ) - ادمین
 *
 * توجه: این مسیرها برای مدیریت گزینه‌ها از پنل ادمین هستند.
 * لیست عمومی همین گزینه‌ها (برای ویزارد کاشی‌یاب) همچنان از /tile-finder/* می‌آید
 * و دست‌نخورده باقی مانده تا فرانت فعلی نشکند.
 */

// ---------- Location ----------
router.get("/locations", protect, adminOnly, ctrl.getLocations);
router.post(
  "/locations",
  protect,
  adminOnly,
  validate(createOptionSchema),
  ctrl.createLocation,
);
router.put(
  "/locations/:id",
  protect,
  adminOnly,
  validate(updateOptionSchema),
  ctrl.updateLocation,
);
router.delete("/locations/:id", protect, adminOnly, ctrl.deleteLocation);

// ---------- Size ----------
router.get("/sizes", protect, adminOnly, ctrl.getSizes);
router.post("/sizes", protect, adminOnly, validate(createOptionSchema), ctrl.createSize);
router.put("/sizes/:id", protect, adminOnly, validate(updateOptionSchema), ctrl.updateSize);
router.delete("/sizes/:id", protect, adminOnly, ctrl.deleteSize);

// ---------- Style ----------
router.get("/styles", protect, adminOnly, ctrl.getStyles);
router.post("/styles", protect, adminOnly, validate(createOptionSchema), ctrl.createStyle);
router.put("/styles/:id", protect, adminOnly, validate(updateOptionSchema), ctrl.updateStyle);
router.delete("/styles/:id", protect, adminOnly, ctrl.deleteStyle);

// ---------- Color ----------
router.get("/colors", protect, adminOnly, ctrl.getColors);
router.post(
  "/colors",
  protect,
  adminOnly,
  validate(createColorOptionSchema),
  ctrl.createColor,
);
router.put(
  "/colors/:id",
  protect,
  adminOnly,
  validate(updateColorOptionSchema),
  ctrl.updateColor,
);
router.delete("/colors/:id", protect, adminOnly, ctrl.deleteColor);

export default router;
