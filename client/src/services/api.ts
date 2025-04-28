import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export interface Game {
  id: number;
  name: string;
  released: string;
  rating: number;
  metacritic: number;
  genres: string[];
  platforms: string[];
  stores: Array<{
    name: string;
    url: string;
  }>;
  platform_ratings: Array<{
    platform: {
      name: string;
    };
    metascore: number;
  }>;
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
    const response = await api.get("/games", { params });
    return response.data;
  },

  getGameDetails: async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },
};
