import { Model, Document } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { Product } from "../models/Product.model";

// چون Location/Size/Style/Color چهارتا مدل با ساختار تقریباً یکسان هستن
// (name, slug, order, +hex اختیاری برای رنگ)، به‌جای تکرار همون کد CRUD
// چهار بار، یک فکتوری عمومی می‌سازیم که با هر کدوم از این مدل‌ها کار می‌کنه.
//
// productField: نام فیلد متناظر توی Product.model (locations/sizes/styles/colors).
// قبل از حذف، چک می‌کنیم هیچ محصولی به این آیتم رفرنس نداده باشه؛ وگرنه
// محصولات یه رفرنس یتیم (dangling) به یه سند حذف‌شده نگه می‌دارن.
export function createOptionService<T extends Document>(
  model: Model<T>,
  productField: "locations" | "sizes" | "styles" | "colors",
) {
  return {
    getAll: async () => {
      return model.find().sort({ order: 1, name: 1 } as never);
    },

    create: async (data: Record<string, unknown>) => {
      return model.create(data as never);
    },

    update: async (id: string, data: Record<string, unknown>) => {
      const doc = await model.findByIdAndUpdate(id, data, { new: true });
      if (!doc) {
        throw new ApiError(404, "مورد یافت نشد");
      }
      return doc;
    },

    remove: async (id: string) => {
      const inUse = await Product.exists({ [productField]: id });
      if (inUse) {
        throw new ApiError(
          409,
          "این مورد در حال حاضر روی حداقل یک محصول استفاده شده و قابل حذف نیست.",
        );
      }

      const doc = await model.findByIdAndDelete(id);
      if (!doc) {
        throw new ApiError(404, "مورد یافت نشد");
      }
      return doc;
    },
  };
}
