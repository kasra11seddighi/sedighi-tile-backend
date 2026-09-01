import { Setting } from "../models/Setting.model";
import type { UpdateSettingInput } from "../validations/setting.validation";

export const getHeader = async () => {
  return Setting.findOne();
};

export const getFooter = async () => {
  return Setting.findOne();
};

// پنل ادمین - ویرایش تنظیمات سایت (هدر و فوتر یک سند مشترکن)
export const updateSetting = async (data: UpdateSettingInput) => {
  const setting = await Setting.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return setting;
};
