import { z } from "zod";

export const applyTileSchema = z.object({
  tileId: z.string().min(1, "شناسه کاشی الزامی است"),
});

export type ApplyTileInput = z.infer<typeof applyTileSchema>;
