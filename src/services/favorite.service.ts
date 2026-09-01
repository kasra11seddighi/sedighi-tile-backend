import { Types } from "mongoose";
import { Favorite } from "../models/Favorite.model";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";

const POPULATE_FIELDS = "name slug price discountPrice images stock";

export const addFavorite = async (userId: Types.ObjectId | string, productId: string) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "محصول یافت نشد.");

  const existing = await Favorite.findOne({ user: userId, product: productId });
  if (existing) {
    // از قبل موجود است؛ خطا نمی‌دهیم تا کلیک تکراری روی قلب مشکلی ایجاد نکند
    return existing.populate("product", POPULATE_FIELDS);
  }

  const favorite = await Favorite.create({ user: userId, product: productId });
  return favorite.populate("product", POPULATE_FIELDS);
};

export const getFavorites = async (userId: Types.ObjectId | string) => {
  return Favorite.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("product", POPULATE_FIELDS);
};

export const removeFavorite = async (userId: Types.ObjectId | string, productId: string) => {
  const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
  if (!favorite) throw new ApiError(404, "این محصول در علاقه‌مندی‌ها یافت نشد.");
  return favorite;
};
