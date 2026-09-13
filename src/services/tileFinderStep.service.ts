import { TileFinderStep } from "../models/TileFinderStep.model";
import { TileFinderLocation } from "../models/TileFinderLocation.model";
import { TileFinderSize } from "../models/TileFinderSize.model";
import { TileFinderStyle } from "../models/TileFinderStyle.model";
import { TileFinderColor } from "../models/TileFinderColor.model";
import { TileFinderCustomOption } from "../models/TileFinderCustomOption.model";
import { Brand } from "../models/Brand.model";
import { ApiError } from "../utils/ApiError";
import type {
  CreateTileFinderStepInput,
  UpdateTileFinderStepInput,
} from "../validations/tileFinderStep.validation";

export const getActiveSteps = async () =>
  TileFinderStep.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

// شکل عمومی هر گزینه که فرانت انتظارش رو داره، صرف‌نظر از این‌که از کدوم
// مدل اومده (Location/Size/Brand/Style/Color یا یک TileFinderCustomOption
// سفارشی). این‌طوری فرانت لازم نیست بدونه هر مرحله از کجا میاد.
interface NormalizedOption {
  id: string;
  title: string;
  value: string;
  hex?: string;
  image?: string;
}

const normalize = (doc: {
  _id: unknown;
  name: string;
  hex?: string | null;
  image?: string | null;
  logo?: string | null;
}): NormalizedOption => ({
  id: String(doc._id),
  title: doc.name,
  value: String(doc._id),
  hex: doc.hex ?? undefined,
  image: doc.image ?? doc.logo ?? undefined,
});

export const getActiveStepsWithOptions = async () => {
  const steps = await getActiveSteps();

  const optionLoaders = {
    locations: async () =>
      (await TileFinderLocation.find().sort({ order: 1, name: 1 }).lean()).map(
        normalize,
      ),
    sizes: async () =>
      (await TileFinderSize.find().sort({ order: 1, name: 1 }).lean()).map(
        normalize,
      ),
    brands: async () =>
      (
        await Brand.find({ isActive: true }).sort({ order: 1, name: 1 }).lean()
      ).map(normalize),
    styles: async () =>
      (await TileFinderStyle.find().sort({ order: 1, name: 1 }).lean()).map(
        normalize,
      ),
    colors: async () =>
      (await TileFinderColor.find().sort({ order: 1, name: 1 }).lean()).map(
        normalize,
      ),
  };

  const cache = new Map<string, NormalizedOption[]>();

  return Promise.all(
    steps.map(async (step) => {
      // مراحل «سفارشی» (custom) به هیچ کدوم از ۵ مدل ثابت بالا وصل نیستن؛
      // گزینه‌هاشون مستقیماً با رفرنس به همین مرحله از TileFinderCustomOption
      // خونده می‌شه و چون هر مرحله‌ی سفارشی گزینه‌های خودش رو داره (برخلاف
      // مثلاً «رنگ» که بین چند مرحله مشترک می‌تونه باشه)، کش هم به‌ازای
      // شناسه‌ی خود مرحله نگه داشته می‌شه، نه source.
      if (step.source === "custom") {
        const cacheKey = `custom:${step._id.toString()}`;
        let options = cache.get(cacheKey);
        if (!options) {
          options = (
            await TileFinderCustomOption.find({ step: step._id })
              .sort({ order: 1, name: 1 })
              .lean()
          ).map(normalize);
          cache.set(cacheKey, options);
        }

        return {
          id: step._id.toString(),
          title: step.title,
          source: step.source,
          order: step.order,
          options,
        };
      }

      let options = cache.get(step.source);
      if (!options) {
        options = (await optionLoaders[step.source]()) as NormalizedOption[];
        cache.set(step.source, options);
      }

      return {
        id: step._id.toString(),
        title: step.title,
        source: step.source,
        order: step.order,
        options,
      };
    }),
  );
};

export const getAllSteps = async () =>
  TileFinderStep.find().sort({ order: 1, createdAt: 1 }).lean();

export const createStep = async (data: CreateTileFinderStepInput) =>
  TileFinderStep.create(data);

export const updateStep = async (
  id: string,
  data: UpdateTileFinderStepInput,
) => {
  const step = await TileFinderStep.findByIdAndUpdate(id, data, { new: true });
  if (!step) throw new ApiError(404, "مرحله فایندر یافت نشد");
  return step;
};

export const deleteStep = async (id: string) => {
  const step = await TileFinderStep.findByIdAndDelete(id);
  if (!step) throw new ApiError(404, "مرحله فایندر یافت نشد");

  // اگه مرحله‌ی سفارشی بود، گزینه‌های یتیم‌شده‌ش رو هم پاک می‌کنیم؛ وگرنه
  // یه‌سری TileFinderCustomOption بدون مرحله‌ی متناظر توی دیتابیس می‌مونن.
  if (step.source === "custom") {
    await TileFinderCustomOption.deleteMany({ step: step._id });
  }

  return step;
};
