import axios from "axios";
import { config } from "../../config";
import {
  RAWGResponse,
  DetailedGame,
  StoreResponse,
  Store,
  SearchQueryParams,
} from "../../types";

export class RawgApiClient {
  private baseUrl = "https://api.rawg.io/api";
  private api: Axios.AxiosInstance;
  private storesCache: { [key: number]: Store } = {};

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      params: {
        key: config.rawgApiKey,
      },
    });
  }

  async initializeStoresCache(): Promise<void> {
    try {
      if (!config.rawgApiKey) {
        throw new Error("RAWG API key not configured");
      }

      const response = await this.api.get<{ results: Store[] }>("/stores");
      this.storesCache = {};
      response.data.results.forEach((store: Store) => {
        this.storesCache[store.id] = store;
      });

      console.log("Stores cache initialized");
    } catch (error) {
      console.error("Failed to initialize stores cache:", error);
      throw error;
    }
  }

  async searchGames(params: SearchQueryParams): Promise<RAWGResponse> {
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

    if (Object.keys(this.storesCache).length === 0) {
      await this.initializeStoresCache();
    }

    console.log("Fetching games from RAWG API");
    const response = await this.api.get<RAWGResponse>("/games", {
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
    return response.data;
  }

  async getGameDetails(gameId: number): Promise<DetailedGame> {
    const response = await this.api.get<DetailedGame>(`/games/${gameId}`);
    return response.data;
  }

  async getGameStores(gameId: number): Promise<StoreResponse> {
    const response = await this.api.get<StoreResponse>(
      `/games/${gameId}/stores`
    );
    return response.data;
  }

  async getGameDetailsWithStores(gameId: number): Promise<{
    details: DetailedGame;
    stores: StoreResponse;
  }> {
    const [details, stores] = await Promise.all([
      this.getGameDetails(gameId),
      this.getGameStores(gameId),
    ]);

    return { details, stores };
  }

  getStoreName(storeId: number): string | undefined {
    return this.storesCache[storeId]?.name;
  }
}
