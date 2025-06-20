import { z } from "zod";

export const searchGamesQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  ordering: z.string().optional(),
  platforms: z.string().optional(),
  genres: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  page_size: z.coerce.number().int().positive().optional(),
});

const storeRequestSchema = z.object({
  store: z.string(),
  url: z.string().url(),
});

export const getGameInfoBodySchema = z.object({
  stores: z.array(storeRequestSchema),
});
