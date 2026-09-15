import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "../validations/product.validation";

export const getAllProducts = async (query: GetProductsQuery) => {
  const {
    search,
    category,
    brand,
    size,
    style,
    color,
    location,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = query;

  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  // sizes/styles/colors/locations روی محصول آرایه‌ان؛ پاس دادن یک id
  // تکی به موتور Mongo خودکار یعنی «آرایه شامل این id باشه»
  if (size) {
    filter.sizes = size;
  }

  if (style) {
    filter.styles = style;
  }

  if (color) {
    filter.colors = color;
  }

  if (location) {
    filter.locations = location;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: { $gte?: number; $lte?: number } = {};
    if (minPrice !== undefined) priceFilter.$gte = minPrice;
    if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
    filter.price = priceFilter;
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
