import { ContactMessage } from "../models/ContactMessage.model";
import { ApiError } from "../utils/ApiError";
import type { CreateContactMessageInput } from "../validations/contactMessage.validation";

export const createMessage = async (data: CreateContactMessageInput) => {
  return ContactMessage.create(data);
};

// برای پنل ادمین (لیست پیام‌های دریافتی)
export const getMessages = async () => {
  return ContactMessage.find().sort("-createdAt");
};

export const markAsRead = async (id: string) => {
  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );

  if (!message) {
    throw new ApiError(404, "پیام یافت نشد");
  }

  return message;
};
