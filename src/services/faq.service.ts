import { Faq } from "../models/Faq.model";
import { ApiError } from "../utils/ApiError";
import type { CreateFaqInput, UpdateFaqInput } from "../validations/faq.validation";

// عمومی - فقط سوالات فعال، مرتب‌شده بر اساس order
export const getPublicFaqs = async () => {
  return Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
};

// ادمین - همه سوالات
export const getAllFaqs = async () => {
  return Faq.find().sort({ order: 1, createdAt: 1 });
};

export const createFaq = async (data: CreateFaqInput) => {
  return Faq.create(data);
};

export const updateFaq = async (id: string, data: UpdateFaqInput) => {
  const faq = await Faq.findByIdAndUpdate(id, data, { new: true });
  if (!faq) {
    throw new ApiError(404, "سوال متداول یافت نشد");
  }
  return faq;
};

export const deleteFaq = async (id: string) => {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) {
    throw new ApiError(404, "سوال متداول یافت نشد");
  }
  return faq;
};
