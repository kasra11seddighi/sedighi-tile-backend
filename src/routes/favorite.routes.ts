import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorite.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addFavoriteSchema } from "../validations/favorite.validation";

const router = Router();

router.use(protect); // همه‌ی روت‌های علاقه‌مندی‌ها نیاز به لاگین دارند

router.get("/", getFavorites);
router.post("/", validate(addFavoriteSchema), addFavorite);
router.delete("/:productId", removeFavorite);

export default router;
