import { StoreName } from "../constants";

interface StoreInfo {
  name: string;
  url: string;
}

export interface SearchQueryParams {
  q?: string;
  ordering?: string;
  platforms?: string;
  genres?: string;
  page?: number;
  page_size?: number;
}

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

export interface StoreRequest {
  store: StoreName;
  url: string;
}
