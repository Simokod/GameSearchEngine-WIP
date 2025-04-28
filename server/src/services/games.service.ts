import axios from "axios";
import { config } from "../config";
import {
  RAWGResponse,
  SearchQueryParams,
  DetailedGame,
  StoreResponse,
  Store,
  Game,
  StoreLink,
} from "../types";

const api = axios.create({
  baseURL: config.rawgBaseUrl,
  params: {
    key: config.rawgApiKey,
  },
});

// Cache for store details
let storesCache: { [key: number]: Store } = {};

export class GamesService {
  static async initializeStoresCache() {
    try {
      if (!config.rawgApiKey) {
        console.error("RAWG API key not configured");
        return;
      }

      // Fetch all stores
      const response = await api.get<{ results: Store[] }>("/stores");

      // Create a map of store_id to store details
      storesCache = response.data.results.reduce((acc, store) => {
        acc[store.id] = store;
        return acc;
      }, {} as { [key: number]: Store });

      console.log("Stores cache initialized:", storesCache);
    } catch (error) {
      console.error("Failed to initialize stores cache:", error);
    }
  }

  static async searchGames(params: SearchQueryParams) {
    const { q: search, ordering, platforms, genres, metacritic } = params;

    if (!search) {
      throw new Error("Search query is required");
    }

    // Reinitialize stores cache if empty
    if (Object.keys(storesCache).length === 0) {
      await this.initializeStoresCache();
    }

    console.log("Fetching games from RAWG API");
    const response = await api.get<RAWGResponse>("/games", {
      params: {
        search,
        page: "1",
        page_size: "10",
        ordering,
        platforms,
        genres,
        metacritic,
      },
    });

    console.log("Games fetched successfully");

    // For each game in the results, fetch its details and store information
    const gamesWithStores = await Promise.all(
      response.data.results.map(async (game: Game) => {
        try {
          // Fetch game details
          const detailsResponse = await api.get<DetailedGame>(
            `/games/${game.id}`
          );

          // Fetch store information
          const storesResponse = await api.get<StoreResponse>(
            `/games/${game.id}/stores`
          );

          // Map store data with names from cache
          const stores = storesResponse.data.results
            .filter((s) => storesCache[s.store_id]) // Only include stores we have info for
            .map((s) => ({
              name: storesCache[s.store_id].name,
              url: s.url,
            }));

          return {
            id: game.id,
            name: game.name,
            released: game.released,
            rating: game.rating,
            metacritic: game.metacritic,
            genres: game.genres.map((g) => g.name),
            platforms: game.platforms.map((p) => p.platform.name),
            stores,
            platform_ratings: detailsResponse.data.metacritic_platforms,
            playtime: detailsResponse.data.playtime,
            website: detailsResponse.data.website || "",
          };
        } catch (error) {
          console.error(`Failed to fetch details for game ${game.id}:`, error);
          return {
            id: game.id,
            name: game.name,
            released: game.released,
            rating: game.rating,
            metacritic: game.metacritic,
            genres: game.genres.map((g) => g.name),
            platforms: game.platforms.map((p) => p.platform.name),
            stores: [],
            platform_ratings: [],
            playtime: 0,
            website: "",
          };
        }
      })
    );

    return {
      games: gamesWithStores,
      count: response.data.count,
    };
  }

  static async getGameDetails(id: string): Promise<DetailedGame> {
    const response = await api.get<DetailedGame>(`/games/${id}`);
    return response.data;
  }

  static async getGameStores(id: string): Promise<StoreResponse> {
    const response = await api.get<StoreResponse>(`/games/${id}/stores`);
    return response.data;
  }
}
