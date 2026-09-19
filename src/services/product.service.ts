import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import { buildProductFilter } from "../filters/productFilter";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "../validations/product.validation";

export const getAllProducts = async (query: GetProductsQuery) => {
  const { page = 1, limit = 12, sort = "-createdAt" } = query;

  const { filter, isImpossible } = await buildProductFilter(query);

  // یکی از فیلترهای رفرنسی (مثلاً یک slug رنگ اشتباه) هیچ سندی resolve
  // نکرده؛ query رو اصلاً به Mongo نمی‌فرستیم چون نتیجه‌ش قطعاً خالیه.
  if (isImpossible) {
    return {
      products: [],
      data: [],
      pagination: { total: 0, page, pages: 0, limit },
    };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug showPrice")
      .populate("brand", "name logo")
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    // برای سازگاری با هر جای فرانت که res.data.data رو می‌خونه
    data: products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

// پنل ادمین - همه محصولات (فعال و غیرفعال)، بدون صفحه‌بندی
export const getAllProductsAdmin = async () => {
  return Product.find()
    .populate("category", "name slug showPrice")
    .populate("brand", "name logo")
    .sort({ createdAt: -1 });
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate("category", "name slug showPrice")
    .populate("brand", "name logo")
    .populate("locations", "name slug")
    .populate("sizes", "name slug")
    .populate("styles", "name slug")
    .populate("colors", "name slug hex");

  if (!product) {
    throw new ApiError(404, "محصول یافت نشد.");
  }

  return product;
};

export const createProduct = async (data: CreateProductInput) => {
  const slug = slugify(data.name);
  return Product.create({ ...data, slug });
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const payload: UpdateProductInput & { slug?: string } = { ...data };
  if (payload.name) payload.slug = slugify(payload.name);

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "محصول یافت نشد.");
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "محصول یافت نشد.");
  }
  return product;
};
