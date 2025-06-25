import axios from "axios";
import { config } from "../../config";
import { DetailedGame, RAWGResponse, StoreResponse, Store } from "./types";
import { SearchQueryParams } from "../../routes/types";

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
    if (Object.keys(this.storesCache).length > 0) return;

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
    const { query, pageSize, page } = params;

    if (!query) {
      throw new Error("Search query is required");
    }

    await this.initializeStoresCache();

    console.log("Fetching games from RAWG API");
    const response = await this.api.get<RAWGResponse>("/games", {
      params: {
        query,
        page,
        page_size: pageSize,
      },
    });

    console.log(
      `RAWG API: ${response.data.results.length} games fetched successfully`
    );
    return response.data;
  }

  async getGameDetails(gameId: number): Promise<DetailedGame> {
    console.log("Fetching game details from RAWG API", gameId);
    const response = await this.api.get<DetailedGame>(`/games/${gameId}`);
    // console.log("Game details fetched successfully", response.data);
    return response.data;
  }

  async getGameStores(gameId: number): Promise<StoreResponse> {
    console.log("Fetching game stores from RAWG API", gameId);
    const response = await this.api.get<StoreResponse>(
      `/games/${gameId}/stores`
    );
    // console.log("Game stores fetched successfully", response.data);
    return response.data;
  }

  getStoreName(storeId: number): string {
    return this.storesCache[storeId]?.name ?? "";
  }
}
