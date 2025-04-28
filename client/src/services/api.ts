import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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
  ratings: Rating[];
  metacritic: number;
  genres: string[];
  platforms: string[];
  stores: Store[];
  platform_ratings: PlatformRating[];
  playtime: number;
  website: string;
}

export interface SearchResponse {
  games: Game[];
  count: number;
}

export interface SearchParams {
  q?: string;
  page?: string;
  page_size?: string;
  ordering?: string;
  platforms?: string;
  genres?: string;
  metacritic?: string;
}

export const gameApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get("/games/search", { params });
    return response.data;
  },
};
