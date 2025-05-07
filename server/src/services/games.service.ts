import axios from "axios";
import { config } from "../config";
import {
  RAWGResponse,
  SearchQueryParams,
  DetailedGame,
  StoreResponse,
  Store,
  Game,
} from "../types";

const api = axios.create({
  baseURL: config.rawgBaseUrl,
  params: {
    key: config.rawgApiKey,
  },
});

let storesCache: { [key: number]: Store } = {};

export const STORE_GOG = "gog";

export class GamesService {
  static async initializeStoresCache() {
    try {
      if (!config.rawgApiKey) {
        console.error("RAWG API key not configured");
        return;
      }

      const response = await api.get<{ results: Store[] }>("/stores");

      storesCache = response.data.results.reduce((acc, store) => {
        acc[store.id] = store;
        return acc;
      }, {} as { [key: number]: Store });

      console.log("Stores cache initialized");
    } catch (error) {
      console.error("Failed to initialize stores cache:", error);
    }
  }

  static async searchGames(params: SearchQueryParams) {
    const {
      q: search,
      ordering,
      platforms,
      genres,
      metacritic,
      page,
      page_size,
    } = params;

    if (!search) {
      throw new Error("Search query is required");
    }

    if (Object.keys(storesCache).length === 0) {
      await this.initializeStoresCache();
    }

    console.log("Fetching games from RAWG API");
    const response = await api.get<RAWGResponse>("/games", {
      params: {
        search,
        page,
        page_size,
        ordering,
        platforms,
        genres,
        metacritic,
      },
    });

    console.log("Games fetched successfully");

    const gamesWithStores = await Promise.all(
      response.data.results.map(async (game: Game) => {
        try {
          const detailsResponse = await api.get<DetailedGame>(
            `/games/${game.id}`
          );

          const storesResponse = await api.get<StoreResponse>(
            `/games/${game.id}/stores`
          );

          console.log("Stores response:", storesResponse.data);
          const stores = storesResponse.data.results
            .filter((s) => storesCache[s.store_id])
            .map((s) => ({
              name: storesCache[s.store_id].name,
              url: s.url,
            }));

          return {
            id: game.id,
            name: game.name,
            released: game.released,
            rating: game.rating,
            ratings: game.ratings,
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

  static async getGameInfo(store: string, url: string) {
    switch (store) {
      case STORE_GOG:
        if (!url.includes("gog.com")) {
          throw new Error("URL does not match GOG store");
        }
        return { rating: 4.3, votes: 1234 };

      default:
        throw new Error(`Store '${store}' not supported yet`);
    }
  }
}
