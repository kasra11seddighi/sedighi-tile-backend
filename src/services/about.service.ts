import { About } from "../models/About.model";
import type { UpdateAboutInput } from "../validations/about.validation";

export const getAboutContent = async () => {
  return About.findOne();
};

// پنل ادمین - ویرایش محتوای صفحه «درباره ما»
// چون یک سند تکیه، اگه هنوز ساخته نشده باشه با upsert می‌سازیمش
export const updateAboutContent = async (data: UpdateAboutInput) => {
  const about = await About.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return about;
};
