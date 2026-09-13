import { z } from "zod";

const menuItemSchema = z.object({
  title: z.string().trim().min(1, "عنوان لازم است"),
  path: z.string().trim().min(1, "مسیر لازم است"),
});

export const updateSettingSchema = z.object({
  logo: z.string().trim().min(1).optional(),
  menu: z.array(menuItemSchema).optional(),
  headerTitle: z.string().trim().optional(),
  headerSubtitle: z.string().trim().optional(),
  logoImage: z.string().trim().optional(),
  description: z.string().trim().optional(),
  quickLinks: z.array(menuItemSchema).optional(),
  helpLinks: z.array(menuItemSchema).optional(),
  social: z
    .object({
      instagram: z.string().trim().optional(),
      telegram: z.string().trim().optional(),
      whatsapp: z.string().trim().optional(),
    })
    .optional(),
  contact: z
    .object({
      phone: z.string().trim().optional(),
      email: z.string().trim().optional(),
      address: z.string().trim().optional(),
    })
    .optional(),
  cartEnabled: z.boolean().optional(),
  shiralatEnabled: z.boolean().optional(),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
