import { z } from "zod";

const buttonSchema = z.object({
  text: z.string().trim().min(1),
  link: z.string().trim().min(1),
});

const slideSchema = z.object({
  image: z.string().trim().min(1),
  alt: z.string().trim().optional(),
});

export const updateHomeSchema = z.object({
  hero: z
    .object({
      badge: z.string().trim().optional(),
      title: z.string().trim().optional(),
      highlightTitle: z.string().trim().optional(),
      description: z.string().trim().optional(),
      primaryButton: buttonSchema.optional(),
      secondaryButton: buttonSchema.optional(),
      slides: z.array(slideSchema).optional(),
    })
    .optional(),
});

export type UpdateHomeInput = z.infer<typeof updateHomeSchema>;
