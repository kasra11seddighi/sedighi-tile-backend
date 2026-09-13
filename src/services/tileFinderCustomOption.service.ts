import { TileFinderCustomOption } from "../models/TileFinderCustomOption.model";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import type {
  CreateCustomOptionInput,
  UpdateCustomOptionInput,
} from "../validations/tileFinderCustomOption.validation";

export const getByStep = async (stepId: string) =>
  TileFinderCustomOption.find({ step: stepId }).sort({ order: 1, name: 1 });

export const create = async (stepId: string, data: CreateCustomOptionInput) =>
  TileFinderCustomOption.create({ ...data, step: stepId });

export const update = async (id: string, data: UpdateCustomOptionInput) => {
  const doc = await TileFinderCustomOption.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new ApiError(404, "مورد یافت نشد");
  return doc;
};

export const remove = async (id: string) => {
  // قبل از حذف، چک می‌کنیم هیچ محصولی از این گزینه استفاده نکرده باشه؛
  // وگرنه محصولات یه رفرنس یتیم (dangling) نگه می‌دارن.
  const inUse = await Product.exists({
    customAttributes: { $elemMatch: { options: id } },
  });
  if (inUse) {
    throw new ApiError(
      409,
      "این مورد در حال حاضر روی حداقل یک محصول استفاده شده و قابل حذف نیست.",
    );
  }

  const doc = await TileFinderCustomOption.findByIdAndDelete(id);
  if (!doc) throw new ApiError(404, "مورد یافت نشد");
  return doc;
};
