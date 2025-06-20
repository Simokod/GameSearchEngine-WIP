import axios from "axios";
import { envConfig } from "../lib/env";
import { StoreRatingInfo, StoreRequest } from "@/types/store";

const api = axios.create({
  baseURL: envConfig.apiBaseUrl,
});

export interface PlatformRating {
  platform: {
    name: string;
  };
  metascore: number;
}

export interface Store {
  name: string;
  url: string;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface Game {
  id: number;
  name: string;
  released: string;
  rating: number;
  genres: string[];
  platforms: string[];
  stores: Store[];
  website: string;
  description: string;
}

export interface SearchResponse {
  games: Game[];
  count: number;
}

export interface SearchParams {
  q?: string;
  page?: string;
  page_size?: number;
  ordering?: string;
  platforms?: string;
  genres?: string;
}

export const gameApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get("/games/search", { params });
    return response.data as SearchResponse;
  },
  getGameInfo: async (
    requests: StoreRequest[]
  ): Promise<Record<string, StoreRatingInfo>> => {
    const response = await api.post("/games/game-info", {
      stores: requests,
    });
    return response.data as Record<string, StoreRatingInfo>;
  },
};
