import { Router } from "express";
import * as ctrl from "../controllers/tileFinderOption.controller";
import * as customCtrl from "../controllers/tileFinderCustomOption.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createOptionSchema,
  updateOptionSchema,
  createColorOptionSchema,
  updateColorOptionSchema,
} from "../validations/tileFinderOption.validation";
import {
  createCustomOptionSchema,
  updateCustomOptionSchema,
} from "../validations/tileFinderCustomOption.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TileFinderOptions
 *   description: مدیریت گزینه‌های کاشی‌یاب (فضا، سایز، سبک، رنگ) - ادمین
 */

// توجه: این مسیرها برای مدیریت گزینه‌ها از پنل ادمین هستند.
// لیست عمومی همین گزینه‌ها (برای ویزارد کاشی‌یاب) همچنان از /tile-finder/* می‌آید
// و دست‌نخورده باقی مانده تا فرانت فعلی نشکند.

// ---------- Location ----------
router.get("/locations", ctrl.getLocations);
router.post(
  "/locations",
  validate(createOptionSchema),
  ctrl.createLocation,
);
router.put(
  "/locations/:id",
  validate(updateOptionSchema),
  ctrl.updateLocation,
);
router.delete("/locations/:id", ctrl.deleteLocation);

// ---------- Size ----------
router.get("/sizes", ctrl.getSizes);
router.post(
  "/sizes",
  validate(createOptionSchema),
  ctrl.createSize,
);
router.put(
  "/sizes/:id",
  validate(updateOptionSchema),
  ctrl.updateSize,
);
router.delete("/sizes/:id", ctrl.deleteSize);

// ---------- Style ----------
router.get("/styles", ctrl.getStyles);
router.post(
  "/styles",
  validate(createOptionSchema),
  ctrl.createStyle,
);
router.put(
  "/styles/:id",
  validate(updateOptionSchema),
  ctrl.updateStyle,
);
router.delete("/styles/:id", ctrl.deleteStyle);

// ---------- Color ----------
router.get("/colors", ctrl.getColors);
router.post(
  "/colors",
  validate(createColorOptionSchema),
  ctrl.createColor,
);
router.put(
  "/colors/:id",
  validate(updateColorOptionSchema),
  ctrl.updateColor,
);
router.delete("/colors/:id", ctrl.deleteColor);

// ---------- Custom (گزینه‌های مراحل سفارشی) ----------
// این مسیرها برای مراحلی هستن که ادمین خودش از پنل ساخته (source: "custom")
// و برخلاف ۴ نوع بالا، به هیچ مدل از پیش تعریف‌شده‌ای وصل نیستن.
router.get("/custom/:stepId", customCtrl.getCustomOptions);
router.post(
  "/custom/:stepId",
  validate(createCustomOptionSchema),
  customCtrl.createCustomOption,
);
router.put(
  "/custom/:stepId/:id",
  validate(updateCustomOptionSchema),
  customCtrl.updateCustomOption,
);
router.delete(
  "/custom/:stepId/:id",
  customCtrl.deleteCustomOption,
);

export default router;
