import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه محصول نامعتبر است");

// افزودن به سبد به دو شکل ممکنه:
// ۱) محصول معمولی (بدون saleUnit): فقط quantity
// ۲) محصول کاشی/سرامیک (با saleUnit): باید مشخص کنه متری می‌خواد یا کارتنی
//    و مقدارش (requestedM2 یا cartons) رو بفرسته. قیمت و تعداد کارتن نهایی
//    همیشه توسط بک‌اند از روی اطلاعات واقعی محصول محاسبه می‌شه، نه از فرانت.
export const addItemSchema = z
  .object({
    productId: objectId,
    quantity: z.coerce.number().min(1).optional(),
    saleUnit: z.enum(["m2", "carton"]).optional(),
    requestedM2: z.coerce.number().positive("متراژ باید بزرگ‌تر از صفر باشد").optional(),
    cartons: z.coerce
      .number()
      .int("تعداد کارتن باید عدد صحیح باشد")
      .positive("تعداد کارتن باید بزرگ‌تر از صفر باشد")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.saleUnit) return; // محصول معمولی؛ همون quantity کافیه

    if (data.saleUnit === "m2" && !data.requestedM2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requestedM2"],
        message: "برای خرید متری، متراژ مورد نیاز الزامی است",
      });
    }

    if (data.saleUnit === "carton" && !data.cartons) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cartons"],
        message: "برای خرید کارتنی، تعداد کارتن الزامی است",
      });
    }
  });

// آپدیت تعداد/مقدار یک آیتم سبد؛ همون منطق دو حالتیِ addItemSchema
export const updateItemSchema = z
  .object({
    quantity: z.coerce.number().min(1, "تعداد باید حداقل ۱ باشد").optional(),
    saleUnit: z.enum(["m2", "carton"]).optional(),
    requestedM2: z.coerce.number().positive("متراژ باید بزرگ‌تر از صفر باشد").optional(),
    cartons: z.coerce
      .number()
      .int("تعداد کارتن باید عدد صحیح باشد")
      .positive("تعداد کارتن باید بزرگ‌تر از صفر باشد")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.saleUnit === "m2" && !data.requestedM2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requestedM2"],
        message: "برای خرید متری، متراژ مورد نیاز الزامی است",
      });
    }
    if (data.saleUnit === "carton" && !data.cartons) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cartons"],
        message: "برای خرید کارتنی، تعداد کارتن الزامی است",
      });
    }
    if (!data.saleUnit && !data.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "تعداد الزامی است",
      });
    }
  });

export type AddItemInput = z.infer<typeof addItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
