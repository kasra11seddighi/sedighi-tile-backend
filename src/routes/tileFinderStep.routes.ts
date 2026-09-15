import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import * as ctrl from "../controllers/tileFinderStep.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createTileFinderStepSchema,
  updateTileFinderStepSchema,
} from "../validations/tileFinderStep.validation";

const router = Router();

// عمومی: مراحل فعال و مرتب‌شده برای ویزارد سایت
router.get("/", ctrl.getActiveSteps);

// ادمین
// از این‌جا به بعد فقط ادمین (نیازمند لاگین و نقش admin)
router.use(protect, adminOnly);

router.get("/all", ctrl.getAllSteps);
router.post("/", validate(createTileFinderStepSchema), ctrl.createStep);
router.put("/:id", validate(updateTileFinderStepSchema), ctrl.updateStep);
router.delete("/:id", ctrl.deleteStep);

export default router;
