import { Model } from "mongoose";
import { Category } from "../models/Category.model";
import { Brand } from "../models/Brand.model";
import { TileFinderSize } from "../models/TileFinderSize.model";
import { TileFinderStyle } from "../models/TileFinderStyle.model";
import { TileFinderColor } from "../models/TileFinderColor.model";
import { TileFinderLocation } from "../models/TileFinderLocation.model";
import { GetProductsQuery } from "../validations/product.validation";

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * مقادیر ورودی یک فیلتر (مثلاً size=6a76...,silver-gray) می‌تونن ترکیبی از
 * ObjectId و slug/name باشن. این تابع همه رو به لیست ObjectId معتبر تبدیل
 * می‌کنه: idهای خام مستقیم قبول می‌شن، بقیه از روی فیلدهای متنی resolve
 * می‌شن.
 *
 * برمی‌گردونه: لیست idها، یا null اگه هیچ مقداری resolve نشد (یعنی این
 * فیلتر باید نتیجه رو خالی کنه، نه اینکه نادیده گرفته بشه).
 */
async function resolveRefIds(
  model: Model<any>,
  rawValues: string[],
  textFields: string[],
): Promise<string[] | null> {
  const values = rawValues.map((v) => v.trim()).filter(Boolean);
  if (!values.length) return null;

  const ids = values.filter((v) => OBJECT_ID_RE.test(v));
  const texts = values.filter((v) => !OBJECT_ID_RE.test(v));

  if (texts.length) {
    const orConditions = textFields.map((field) => ({
      [field]: {
        $in: texts.map((t) => new RegExp(`^${escapeRegex(t)}$`, "i")),
      },
    }));
    const docs = await model.find({ $or: orConditions }).select("_id").lean();
    ids.push(...docs.map((d: any) => String(d._id)));
  }

  // اگه ورودی داشتیم ولی هیچی resolve نشد (مثلاً slug اشتباه)، باید صریحاً
  // بگیم «هیچی» نه اینکه فیلتر رو نادیده بگیریم و همه‌چیز رو برگردونیم.
  return ids.length ? [...new Set(ids)] : [];
}

export interface ProductFilterResult {
  filter: Record<string, unknown>;
  /** true یعنی حداقل یکی از فیلترهای رفرنسی resolve نشد؛ نتیجه قطعاً خالیه */
  isImpossible: boolean;
}

const REF_CONFIG: Array<{
  key: keyof Pick<
    GetProductsQuery,
    "category" | "brand" | "size" | "style" | "color" | "location"
  >;
  model: Model<any>;
  productField: string;
  textFields: string[];
}> = [
  {
    key: "category",
    model: Category,
    productField: "category",
    textFields: ["slug", "name"],
  },
  { key: "brand", model: Brand, productField: "brand", textFields: ["name"] },
  {
    key: "size",
    model: TileFinderSize,
    productField: "sizes",
    textFields: ["slug", "name"],
  },
  {
    key: "style",
    model: TileFinderStyle,
    productField: "styles",
    textFields: ["slug", "name"],
  },
  {
    key: "color",
    model: TileFinderColor,
    productField: "colors",
    textFields: ["slug", "name"],
  },
  {
    key: "location",
    model: TileFinderLocation,
    productField: "locations",
    textFields: ["slug", "name"],
  },
];

/**
 * ورودی کوئری (که تا اینجا فقط zod-parsed شده) رو به یک filter واقعی برای
 * Product.find می‌سازه. تنها نقطه‌ای که منطق «id یا slug؟» و «تکی یا
 * چندتایی؟» رو می‌دونه همینجاست؛ سرویس فقط نتیجه رو مصرف می‌کنه.
 */
export async function buildProductFilter(
  query: GetProductsQuery,
): Promise<ProductFilterResult> {
  const filter: Record<string, unknown> = { isActive: true };
  let isImpossible = false;

  const resolutions = await Promise.all(
    REF_CONFIG.map(async (cfg) => {
      const raw = query[cfg.key];
      if (!raw || !raw.length) return null;
      const ids = await resolveRefIds(cfg.model, raw, cfg.textFields);
      return { cfg, ids };
    }),
  );

  for (const res of resolutions) {
    if (!res) continue;
    const { cfg, ids } = res;
    if (ids === null) continue;
    if (ids.length === 0) {
      isImpossible = true;
      continue;
    }
    // category/brand روی محصول تکی‌ان؛ sizes/styles/colors/locations آرایه‌ان
    // اما هر دو با $in درست کار می‌کنن (mongoose خودکار «شامل» رو چک می‌کنه)
    filter[cfg.productField] = { $in: ids };
  }

  if (query.search) {
    const re = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: re }, { description: re }, { sku: re }];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const priceFilter: { $gte?: number; $lte?: number } = {};
    if (query.minPrice !== undefined) priceFilter.$gte = query.minPrice;
    if (query.maxPrice !== undefined) priceFilter.$lte = query.maxPrice;
    filter.price = priceFilter;
  }

  return { filter, isImpossible };
}

// export شده برای تست مستقیم / استفاده‌ی احتمالی توی جاهای دیگه (مثلاً شمارش
// محصولات یک برند برای صفحه‌ی برند)
export { resolveRefIds };
