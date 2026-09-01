import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  // ایمیل اختیاریه چون ویجت «پشتیبانی آنلاین» فقط نام/شماره/پیام می‌گیره
  // و از همین اندپوینت استفاده می‌کنه؛ فرم صفحه‌ی تماس همچنان خودش
  // (سمت فرانت) ایمیل رو required نگه می‌داره.
  email: z.string().trim().email("ایمیل نامعتبر است").optional(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ کاراکتر باشد"),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
