import { z } from "zod";

const heroSchema = z.object({
  badge: z.string().trim().optional(),
  titleBefore: z.string().trim().optional(),
  titleHighlight: z.string().trim().optional(),
  titleAfter: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

const statSchema = z.object({
  icon: z.string().trim().optional(),
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const storySchema = z.object({
  badge: z.string().trim().optional(),
  title: z.string().trim().optional(),
  paragraph1: z.string().trim().optional(),
  paragraph2: z.string().trim().optional(),
  image: z.string().trim().optional(),
  experienceValue: z.string().trim().optional(),
  experienceLabel: z.string().trim().optional(),
});

const valueItemSchema = z.object({
  icon: z.string().trim().optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const valuesSchema = z.object({
  badge: z.string().trim().optional(),
  title: z.string().trim().optional(),
  items: z.array(valueItemSchema).optional(),
});

const ctaSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const updateAboutSchema = z.object({
  hero: heroSchema.optional(),
  stats: z.array(statSchema).optional(),
  story: storySchema.optional(),
  values: valuesSchema.optional(),
  cta: ctaSchema.optional(),
});

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
