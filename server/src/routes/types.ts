import { z } from "zod";
import { getGameInfoBodySchema, searchGamesQuerySchema } from "./schemas";

export type SearchQueryParams = z.infer<typeof searchGamesQuerySchema>;
export type StoreRequest = z.infer<
  typeof getGameInfoBodySchema
>["stores"][number];

export interface SearchResponse {
  games: FullGameInfo[];
}

export interface FullGameInfo {
  id: number;
  name: string;
  released: string;
  rating: number;
  genres?: string[];
  platforms?: string[];
  stores: Array<{
    name: string;
    url: string;
  }>;
  website: string;
  description: string;
}
