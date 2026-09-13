import { Router } from "express";
import * as tileFinderController from "../controllers/tileFinder.controller";
import { getActiveStepsWithOptions } from "../controllers/tileFinderStep.controller";
import { validate } from "../middlewares/validate.middleware";
import { filterProductsSchema } from "../validations/tileFinder.validation";

const router = Router();

// مراحل و گزینه‌های ویزارد فایندر
router.get("/steps", getActiveStepsWithOptions);

// گزینه‌های فیلتر (Options)
router.get("/locations", tileFinderController.getLocations);
router.get("/sizes", tileFinderController.getSizes);
router.get("/brands", tileFinderController.getBrands);
router.get("/styles", tileFinderController.getStyles);
router.get("/colors", tileFinderController.getColors);

// لیست کامل محصولات (populate شده)
router.get("/products", tileFinderController.getProducts);

// فیلتر محصولات بر اساس انتخاب کاربر
router.post("/filter", validate(filterProductsSchema), tileFinderController.filterProducts);

export default router;
