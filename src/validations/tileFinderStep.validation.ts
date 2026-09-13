import { z } from "zod";

const source = z.enum(["locations", "sizes", "brands", "styles", "colors", "custom"]);

export const createTileFinderStepSchema = z.object({
  title: z.string().trim().min(1, "عنوان مرحله الزامی است"),
  source,
  order: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateTileFinderStepSchema = createTileFinderStepSchema.partial();

export type CreateTileFinderStepInput = z.infer<typeof createTileFinderStepSchema>;
export type UpdateTileFinderStepInput = z.infer<typeof updateTileFinderStepSchema>;
