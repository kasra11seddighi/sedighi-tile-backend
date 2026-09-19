import { z } from "zod";
import { SORT_OPTION_VALUES } from "../models/ProductSortOption.model";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نامعتبر است");

// رنگ‌های مستقل محصول - هر کدوم کد و موجودی جدا داره (نه فقط برای نمایش عکس)
const colorVariantSchema = z.object({
  name: z.string().trim().min(1, "نام رنگ الزامی است"),
  hex: z.string().trim().optional(),
  image: z.string().trim().optional(),
  code: z.string().trim().min(1, "کد رنگ الزامی است"),
  stock: z.coerce.number().min(0, "موجودی نمی‌تواند منفی باشد").optional(),
});

// مقدار محصول برای یک مرحله‌ی سفارشی فایندر کاشی
const customAttributeSchema = z.object({
  step: objectId,
  options: z.array(objectId),
});

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

// --- مشخصات فنی نمایشی (جدول «مشخصات فنی» توی صفحه‌ی محصول) ---
// همه اختیاری‌اند؛ هر دسته‌بندی زیرمجموعه‌ی متفاوتی از این‌ها رو پر می‌کنه.
const productSpecFields = {
  glazeType: z.string().trim().optional(),
  bodyMaterial: z.string().trim().optional(),
  wearResistance: z.string().trim().optional(),
  suitableFor: z.array(z.string().trim()).optional(),
  colorDescription: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  thickness: z.coerce.number().min(0, "ضخامت نمی‌تواند منفی باشد").optional(),
  finish: z.string().trim().optional(),
  qualityGrade: z.string().trim().optional(),
  originCountry: z.string().trim().optional(),
  weightPerCarton: z.coerce.number().min(0, "وزن هر کارتن نمی‌تواند منفی باشد").optional(),
  waterAbsorption: z.string().trim().optional(),
  warranty: z.string().trim().optional(),
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
    customAttributes: z.array(customAttributeSchema).optional(),
    colorVariants: z.array(colorVariantSchema).optional(),
    isActive: z.boolean().optional(),
    ...tileSaleFields,
    ...productSpecFields,
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
    customAttributes: z.array(customAttributeSchema).optional(),
    colorVariants: z.array(colorVariantSchema).optional(),
    isActive: z.boolean().optional(),
    ...tileSaleFields,
    ...productSpecFields,
  })
  .superRefine(validateSaleUnitConsistency);

// یک مقدار فیلتر می‌تونه id باشه، slug باشه، چندتایی با کاما، یا چند بار
// توی کوئری تکرار شده باشه (?color=a&color=b). همه رو به آرایه‌ی رشته تبدیل
// می‌کنیم و تصمیم‌گیری درباره‌ی id/slug رو به سرویس می‌سپاریم.
const filterValues = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    const list = (Array.isArray(v) ? v : v.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
    return list.length ? list : undefined;
  });

export const getProductsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: filterValues,
  brand: filterValues,
  // فیلترهای مبتنی بر همون رفرنس‌هایی که فایندر کاشی هم استفاده می‌کنه
  // (TileFinderSize/Style/Color/Location)
  size: filterValues,
  style: filterValues,
  color: filterValues,
  location: filterValues,
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  // مقدار نامعتبر رو به‌جای خطای ۴۰۰، به پیش‌فرض برمی‌گردونیم تا یک
  // پارامتر اشتباه سمت فرانت، کل لیست محصولات رو خالی نکنه.
  sort: z
    .string()
    .optional()
    .transform((v) =>
      v && (SORT_OPTION_VALUES as readonly string[]).includes(v)
        ? (v as (typeof SORT_OPTION_VALUES)[number])
        : undefined,
    ),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
