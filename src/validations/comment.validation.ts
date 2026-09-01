import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نامعتبر است");

export const createCommentSchema = z.object({
  product: objectId,
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().trim().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  text: z.string().trim().min(3, "متن نظر باید حداقل ۳ کاراکتر باشد"),
  rating: z.coerce.number().min(1).max(5).optional(),
});

export const getCommentsQuerySchema = z.object({
  product: objectId.optional(),
  isApproved: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;
