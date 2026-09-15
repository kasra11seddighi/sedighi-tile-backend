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

// روت‌های پنل ادمین: قبلاً عمداً بدون protect/adminOnly بودن، اما چون
// قراره سرور پابلیک بشه الان پشت لاگین ادمین گذاشته شدن.
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put(
  "/:id/status",
  protect,
  adminOnly,
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

// از این‌جا به بعد فقط برای مشتری‌های سایت اصلیه؛ سفارش‌های خودشون رو
// می‌بینن/می‌سازن، پس همچنان نیاز به لاگین دارن.
router.use(protect);

router.post("/", validate(createOrderSchema), createOrder);
router.get("/my-orders", getMyOrders);
router.put("/:id/cancel", cancelMyOrder);
router.post("/:id/pay", payOrder);
router.get("/:id/verify", verifyPayment);
router.get("/:id", getOrder);

export default router;
