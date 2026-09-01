import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(1, "نام گیرنده الزامی است"),
  phone: z.string().trim().min(1, "شماره تماس الزامی است"),
  // شماره‌ی ثابت اختیاریه
  landlinePhone: z.string().trim().optional(),
  address: z.string().trim().min(1, "آدرس الزامی است"),
  city: z.string().trim().min(1, "شهر الزامی است"),
  postalCode: z.string().trim().min(1, "کد پستی الزامی است"),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "online"]).default("cod"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
