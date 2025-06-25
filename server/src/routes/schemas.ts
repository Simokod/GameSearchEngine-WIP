import { z } from "zod";

export const searchGamesQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  pageSize: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

const storeRequestSchema = z.object({
  store: z.string(),
  url: z.string().url(),
});

export const getGameInfoBodySchema = z.object({
  stores: z.array(storeRequestSchema),
});
