import { Category } from "../models/Category.model";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import { CreateCategoryInput, UpdateCategoryInput } from "../validations/category.validation";

export const getAllCategories = async () => {
  return Category.find().sort({ createdAt: -1 });
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "دسته‌بندی یافت نشد.");
  return category;
};

export const createCategory = async ({ name, description, showPrice }: CreateCategoryInput) => {
  const slug = slugify(name);
  return Category.create({ name, description, showPrice, slug });
};

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const payload: UpdateCategoryInput & { slug?: string } = { ...data };
  if (payload.name) payload.slug = slugify(payload.name);

  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "دسته‌بندی یافت نشد.");
  return category;
};

export const deleteCategory = async (id: string) => {
  // قبل از حذف چک می‌کنیم محصولی به این دسته‌بندی وصل نباشه؛ وگرنه
  // محصولات با یک رفرنس یتیم (category حذف‌شده) باقی می‌مونن.
  const inUse = await Product.exists({ category: id });
  if (inUse) {
    throw new ApiError(
      409,
      "این دسته‌بندی در حال حاضر روی حداقل یک محصول استفاده شده و قابل حذف نیست.",
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "دسته‌بندی یافت نشد.");
  return category;
};
