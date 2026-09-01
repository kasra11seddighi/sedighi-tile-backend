import { Home } from "../models/Home.model";
import { ApiError } from "../utils/ApiError";
import type { UpdateHomeInput } from "../validations/home.validation";

export const getHomeData = async () => {
  const home = await Home.findOne();
  if (!home) {
    throw new ApiError(404, "اطلاعات صفحه اصلی یافت نشد.");
  }
  return home;
};

// پنل ادمین - ویرایش محتوای صفحه اصلی (فعلاً فقط هیرو)
// چون این یک سند تکی است، اگر هنوز ساخته نشده باشه با upsert می‌سازیمش
export const updateHomeData = async (data: UpdateHomeInput) => {
  const home = await Home.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return home;
};
