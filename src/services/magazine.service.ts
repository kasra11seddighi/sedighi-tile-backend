import { Magazine } from "../models/Magazine.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import type {
  CreateMagazineInput,
  UpdateMagazineInput,
} from "../validations/magazine.validation";

// اگه ادمین اسلاگ رو دستی نداده باشه، از روی عنوان می‌سازیمش؛ اگه همون
// اسلاگ از قبل وجود داشت، یه پسوند عددی بهش اضافه می‌کنیم تا یکتا بمونه.
async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 1;
  while (
    await Magazine.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })
  ) {
    suffix += 1;
    slug = `${slugify(base)}-${suffix}`;
  }
  return slug;
}

export const getPublishedMagazines = async () => {
  return Magazine.find({ isPublished: true })
    .select("title slug excerpt coverImage author readTime tags createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const getMagazineBySlug = async (slug: string) => {
  const article = await Magazine.findOne({ slug, isPublished: true });
  if (!article) {
    throw new ApiError(404, "مقاله یافت نشد");
  }
  return article;
};

// پنل ادمین - همه‌ی مقاله‌ها (منتشرشده و پیش‌نویس)
export const getAllMagazines = async () => {
  return Magazine.find().sort({ createdAt: -1 });
};

export const createMagazine = async (data: CreateMagazineInput) => {
  const slug = await ensureUniqueSlug(data.slug?.trim() || data.title);
  return Magazine.create({ ...data, slug });
};

export const updateMagazine = async (id: string, data: UpdateMagazineInput) => {
  const payload: UpdateMagazineInput & { slug?: string } = { ...data };

  if (data.slug || data.title) {
    payload.slug = await ensureUniqueSlug(data.slug?.trim() || data.title!, id);
  }

  const article = await Magazine.findByIdAndUpdate(id, payload, { new: true });
  if (!article) {
    throw new ApiError(404, "مقاله یافت نشد");
  }
  return article;
};

export const deleteMagazine = async (id: string) => {
  const article = await Magazine.findByIdAndDelete(id);
  if (!article) {
    throw new ApiError(404, "مقاله یافت نشد");
  }
  return article;
};
