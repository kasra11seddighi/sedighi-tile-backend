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
import { validate } from "../middlewares/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validations/order.validation";

const router = Router();

// روت‌های پنل ادمین: عمداً بدون protect/adminOnly (قبل از router.use(protect)
// تعریف شدن) چون تصمیم گرفته شده پنل ادمین لاگین نداشته باشه.
router.get("/admin/all", getAllOrders);
router.put("/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);

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
