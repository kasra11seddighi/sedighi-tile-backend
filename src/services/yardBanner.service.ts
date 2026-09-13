import { YardBanner } from "../models/YardBanner.model";
import { ApiError } from "../utils/ApiError";
import type {
  CreateYardBannerInput,
  UpdateYardBannerInput,
  GetYardBannersQuery,
} from "../validations/yardBanner.validation";

// عمومی - فقط بنرهای فعال، مرتب‌شده بر اساس order (مثل Testimonial/Faq)
export const getPublicYardBanners = async (query: GetYardBannersQuery) => {
  const { limit } = query;

  const q = YardBanner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

  if (limit) q.limit(limit);

  return q;
};

// ادمین - همه بنرها (فعال و غیرفعال)
export const getAllYardBanners = async () => {
  return YardBanner.find().sort({ order: 1, createdAt: -1 });
};

export const createYardBanner = async (data: CreateYardBannerInput) => {
  return YardBanner.create(data);
};

export const updateYardBanner = async (id: string, data: UpdateYardBannerInput) => {
  const banner = await YardBanner.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    throw new ApiError(404, "بنر مورد نظر یافت نشد.");
  }

  return banner;
};

export const deleteYardBanner = async (id: string) => {
  const banner = await YardBanner.findByIdAndDelete(id);

  if (!banner) {
    throw new ApiError(404, "بنر مورد نظر یافت نشد.");
  }

  return banner;
};
