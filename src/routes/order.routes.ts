import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  payOrder,
  verifyPayment,
  cancelMyOrder,
} from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validations/order.validation";

const router = Router();

router.use(protect);

router.post("/", validate(createOrderSchema), createOrder);
router.get("/my-orders", getMyOrders);
router.get("/admin/all", adminOnly, getAllOrders);
router.put("/:id/status", adminOnly, validate(updateOrderStatusSchema), updateOrderStatus);
router.put("/:id/cancel", cancelMyOrder);
router.post("/:id/pay", payOrder);
router.get("/:id/verify", verifyPayment);
router.get("/:id", getOrder);

export default router;
