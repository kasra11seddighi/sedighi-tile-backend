import { Brand } from "../models/Brand.model";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import type {
  CreateBrandInput,
  UpdateBrandInput,
} from "../validations/brand.validation";

export const getActiveBrands = async () => {
  return Brand.find({ isActive: true })
    .select("name logo shortDescription order")
    .sort({ order: 1, createdAt: -1 })
    .lean();
};

// پنل ادمین - همه برندها (فعال و غیرفعال)
export const getAllBrands = async () => {
  return Brand.find().sort({ order: 1, createdAt: -1 });
};

export const createBrand = async (data: CreateBrandInput) => {
  return Brand.create(data);
};

export const updateBrand = async (id: string, data: UpdateBrandInput) => {
  const brand = await Brand.findByIdAndUpdate(id, data, { new: true });
  if (!brand) {
    throw new ApiError(404, "برند یافت نشد");
  }
  return brand;
};

export const deleteBrand = async (id: string) => {
  // قبل از حذف چک می‌کنیم محصولی به این برند وصل نباشه؛ وگرنه محصولات
  // با یک رفرنس یتیم (brand حذف‌شده) باقی می‌مونن.
  const inUse = await Product.exists({ brand: id });
  if (inUse) {
    throw new ApiError(
      409,
      "این برند در حال حاضر روی حداقل یک محصول استفاده شده و قابل حذف نیست.",
    );
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new ApiError(404, "برند یافت نشد");
  }
  return brand;
};
