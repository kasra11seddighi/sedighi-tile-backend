import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه محصول نامعتبر است");

export const addFavoriteSchema = z.object({
  productId: objectId,
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
