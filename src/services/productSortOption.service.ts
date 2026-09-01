import { ProductSortOption } from "../models/ProductSortOption.model";
import { ApiError } from "../utils/ApiError";
import {
  CreateSortOptionInput,
  UpdateSortOptionInput,
} from "../validations/productSortOption.validation";

// فقط گزینه‌های فعال، مرتب بر اساس order — همینی که فیلتر عمومی صفحه‌ی
// محصولات (dropdown مرتب‌سازی) استفاده می‌کنه.
export const getActiveSortOptions = async () => {
  return ProductSortOption.find({ isActive: true }).sort({ order: 1 });
};

// همه‌ی گزینه‌ها (فعال و غیرفعال) — برای لیست داشبورد مدیریتی.
export const getAllSortOptionsAdmin = async () => {
  return ProductSortOption.find().sort({ order: 1 });
};

export const createSortOption = async (data: CreateSortOptionInput) => {
  const exists = await ProductSortOption.findOne({ value: data.value });
  if (exists) {
    throw new ApiError(409, "این گزینه‌ی مرتب‌سازی قبلاً ثبت شده است.");
  }
  return ProductSortOption.create(data);
};

export const updateSortOption = async (
  id: string,
  data: UpdateSortOptionInput,
) => {
  const option = await ProductSortOption.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!option) throw new ApiError(404, "گزینه‌ی مرتب‌سازی یافت نشد.");
  return option;
};

export const deleteSortOption = async (id: string) => {
  const option = await ProductSortOption.findByIdAndDelete(id);
  if (!option) throw new ApiError(404, "گزینه‌ی مرتب‌سازی یافت نشد.");
  return option;
};
