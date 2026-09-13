import { Product } from "../models/Product.model";
import { Brand } from "../models/Brand.model";
import { TileFinderLocation } from "../models/TileFinderLocation.model";
import { TileFinderSize } from "../models/TileFinderSize.model";
import { TileFinderStyle } from "../models/TileFinderStyle.model";
import { TileFinderColor } from "../models/TileFinderColor.model";
import { FilterProductsInput } from "../validations/tileFinder.validation";

interface FinderOption {
  id: string;
  title: string;
  value: string;
  hex?: string;
  image?: string;
}

// ===============================
// GET LOCATIONS
// ===============================

export const getLocations = async (): Promise<FinderOption[]> => {
  const locations = await TileFinderLocation.find({})
    .sort({ order: 1, name: 1 })
    .lean();

  return [
    { id: "all", title: "همه فضاها", value: "" },
    ...locations.map((location) => ({
      id: location._id.toString(),
      title: location.name,
      value: location._id.toString(),
    })),
  ];
};

// ===============================
// GET SIZES
// ===============================

export const getSizes = async (): Promise<FinderOption[]> => {
  const sizes = await TileFinderSize.find({})
    .sort({ order: 1, name: 1 })
    .lean();

  return [
    { id: "all", title: "همه سایزها", value: "" },
    ...sizes.map((size) => ({
      id: size._id.toString(),
      title: size.name,
      value: size._id.toString(),
    })),
  ];
};

// ===============================
// GET BRANDS
// ===============================

export const getBrands = async (): Promise<FinderOption[]> => {
  const brands = await Brand.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .lean();

  return [
    { id: "all", title: "همه برندها", value: "" },
    ...brands.map((brand) => ({
      id: brand._id.toString(),
      title: brand.name,
      value: brand._id.toString(),
      image: brand.logo,
    })),
  ];
};

// ===============================
// GET STYLES
// ===============================

export const getStyles = async (): Promise<FinderOption[]> => {
  const styles = await TileFinderStyle.find({})
    .sort({ order: 1, name: 1 })
    .lean();

  return [
    { id: "all", title: "همه سبک‌ها", value: "" },
    ...styles.map((style) => ({
      id: style._id.toString(),
      title: style.name,
      value: style._id.toString(),
    })),
  ];
};

// ===============================
// GET COLORS
// ===============================

export const getColors = async (): Promise<FinderOption[]> => {
  const colors = await TileFinderColor.find({})
    .sort({ order: 1, name: 1 })
    .lean();

  return [
    { id: "all", title: "همه رنگ‌ها", value: "", hex: "#FFFFFF" },
    ...colors.map((color) => ({
      id: color._id.toString(),
      title: color.name,
      value: color._id.toString(),
      hex: color.hex ?? undefined,
    })),
  ];
};

// ===============================
// GET ALL PRODUCTS (populate شده، برای لیست/دیباگ)
// ===============================

export const getProducts = async () => {
  return Product.find({ isActive: true })
    .populate("brand", "name logo")
    .populate("category", "name slug")
    .populate("locations", "name slug")
    .populate("sizes", "name slug")
    .populate("styles", "name slug")
    .populate("colors", "name slug hex")
    .sort({ createdAt: -1 })
    .lean();
};

// ===============================
// FILTER PRODUCTS
// این تنها پیاده‌سازی filterProducts در کل پروژه است.
// ===============================

export const filterProducts = async (filters: FilterProductsInput = {}) => {
  const query: Record<string, unknown> = { isActive: true };

  if (filters.location) query.locations = filters.location;
  if (filters.size) query.sizes = filters.size;
  if (filters.brand) query.brand = filters.brand;
  if (filters.style) query.styles = filters.style;
  if (filters.color) query.colors = filters.color;

  // فیلترهای مراحل سفارشی: هر مرحله باید جداگانه با $elemMatch چک بشه
  // (چون customAttributes یه آرایه از {step, options[]} هست) و همه‌شون
  // باید هم‌زمان برقرار باشن، پس با $and ترکیب می‌شن.
  if (filters.custom?.length) {
    query.$and = filters.custom.map((c) => ({
      customAttributes: { $elemMatch: { step: c.step, options: c.option } },
    }));
  }

  const products = await Product.find(query)
    .populate("brand", "name logo")
    .populate("category", "name slug")
    .populate("locations", "name slug")
    .populate("sizes", "name slug")
    .populate("styles", "name slug")
    .populate("colors", "name slug hex")
    .populate("customAttributes.options", "name slug hex")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return products;
};
