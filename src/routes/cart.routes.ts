import { Router } from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cart.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addItemSchema, updateItemSchema } from "../validations/cart.validation";

const router = Router();

router.use(protect); // همه‌ی روت‌های سبد خرید نیاز به لاگین دارند

router.get("/", getCart);
router.post("/", validate(addItemSchema), addItem);
router.put("/:productId", validate(updateItemSchema), updateItem);
router.delete("/:productId", removeItem);
router.delete("/", clearCart);

export default router;
