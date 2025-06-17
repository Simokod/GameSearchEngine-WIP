import { DetailedGame } from "@/services/clients/types";

interface StoreInfo {
  name: string;
  url: string;
}

export interface SearchQueryParams {
  q?: string;
  page?: string;
  page_size?: number;
  ordering?: string;
  platforms?: string;
  genres?: string;
}

export interface SearchResponse {
  games: FullGameInfo[];
}

export interface FullGameInfo
  extends Omit<
    DetailedGame,
    "platforms" | "stores" | "genres" | "slug" | "background_image"
  > {
  platforms: string[];
  stores: StoreInfo[];
  genres: string[];
}
