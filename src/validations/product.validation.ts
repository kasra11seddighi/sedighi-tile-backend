import { z } from "zod";
import { SORT_OPTION_VALUES } from "../models/ProductSortOption.model";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نامعتبر است");

// --- فروش متری/کارتنی ---
// همه اختیاری‌اند: محصولی که saleUnit نداره، دقیقاً مثل قبل با price ساده فروخته می‌شه
const tileSaleFields = {
  pricePerM2: z.coerce.number().min(0, "قیمت هر مترمربع نمی‌تواند منفی باشد").optional(),
  pricePerCarton: z.coerce.number().min(0, "قیمت هر کارتن نمی‌تواند منفی باشد").optional(),
  piecesPerCarton: z.coerce.number().positive("تعداد کاشی در کارتن باید بزرگ‌تر از صفر باشد").optional(),
  m2PerCarton: z.coerce.number().positive("متراژ هر کارتن باید بزرگ‌تر از صفر باشد").optional(),
  tileWidth: z.coerce.number().positive("عرض کاشی باید بزرگ‌تر از صفر باشد").optional(),
  tileHeight: z.coerce.number().positive("ارتفاع کاشی باید بزرگ‌تر از صفر باشد").optional(),
  saleUnit: z.enum(["m2", "carton", "both"]).optional(),
};

// اگه saleUnit ست شده، بسته به نوعش، قیمت واحد لازم رو هم باید داشته باشیم
// وگرنه بعداً موقع افزودن به سبد نمی‌شه قیمت رو محاسبه کرد
function validateSaleUnitConsistency(
  data: {
    saleUnit?: "m2" | "carton" | "both";
    pricePerM2?: number;
    pricePerCarton?: number;
  },
  ctx: z.RefinementCtx,
) {
  if (!data.saleUnit) return;

  if (
    (data.saleUnit === "m2" || data.saleUnit === "both") &&
    !data.pricePerM2
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pricePerM2"],
      message: "برای فروش متری، قیمت هر مترمربع الزامی است",
    });
  }

  if (
    (data.saleUnit === "carton" || data.saleUnit === "both") &&
    !data.pricePerCarton
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pricePerCarton"],
      message: "برای فروش کارتنی، قیمت هر کارتن الزامی است",
    });
  }
}

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "نام محصول الزامی است"),
    description: z.string().trim().optional(),
    price: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد"),
    discountPrice: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    category: objectId,
    brand: objectId.optional().nullable(),
    locations: z.array(objectId).optional(),
    sizes: z.array(objectId).optional(),
    styles: z.array(objectId).optional(),
    colors: z.array(objectId).optional(),
    isActive: z.boolean().optional(),
    ...tileSaleFields,
  })
  .superRefine(validateSaleUnitConsistency);

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1, "نام محصول الزامی است").optional(),
    description: z.string().trim().optional(),
    price: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد").optional(),
    discountPrice: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    category: objectId.optional(),
    brand: objectId.optional().nullable(),
    locations: z.array(objectId).optional(),
    sizes: z.array(objectId).optional(),
    styles: z.array(objectId).optional(),
    colors: z.array(objectId).optional(),
    isActive: z.boolean().optional(),
    ...tileSaleFields,
  })
  .superRefine(validateSaleUnitConsistency);

export const getProductsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: objectId.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  // قبلاً z.string() آزاد بود؛ محدودش می‌کنیم به همون مقادیری که واقعاً
  // پشتیبانی می‌شن (همون‌هایی که توی ProductSortOption ثبت می‌کنیم) تا کسی
  // نتونه یه فیلد دلخواه رو به‌عنوان sort پاس بده.
  sort: z.enum(SORT_OPTION_VALUES).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
