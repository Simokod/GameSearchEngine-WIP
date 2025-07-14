import axios from "axios";
import { config } from "../../config";
import {
  DetailedGame,
  RAWGResponse,
  StoreResponse,
  Store,
  RawgGame,
  Genre,
  Platform,
} from "./types";
import {
  GameDbClient,
  GameDbSearchParams,
  GameDbGameSummary,
  GameDbGameDetails,
} from "./gamedb/types";

export class RawgApiClient implements GameDbClient {
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

  async searchGames(params: GameDbSearchParams): Promise<GameDbGameSummary[]> {
    const {
      query,
      genres,
      platforms,
      tags,
      dates,
      developers,
      publishers,
      page,
      pageSize,
    } = params;

    if (!query) {
      throw new Error("Search query is required");
    }

    await this.initializeStoresCache();

    // Map params to RAWG API params
    const rawgParams: any = {
      search: query,
      page,
      page_size: pageSize,
    };
    if (genres && genres.length) rawgParams.genres = genres.join(",");
    if (platforms && platforms.length)
      rawgParams.platforms = platforms.join(",");
    if (tags && tags.length) rawgParams.tags = tags.join(",");
    if (dates) rawgParams.dates = dates;
    if (developers && developers.length)
      rawgParams.developers = developers.join(",");
    if (publishers && publishers.length)
      rawgParams.publishers = publishers.join(",");

    console.log("Fetching games from RAWG API", rawgParams);
    const response = await this.api.get<RAWGResponse>("/games", {
      params: rawgParams,
    });

    return response.data.results.map((game: RawgGame) => ({
      id: game.id,
      name: game.name,
      released: game.released,
      genres: game.genres?.map((g: Genre) => g.name),
      platforms: game.platforms?.map((p: Platform) => p.platform.name),
      coverUrl: game.background_image,
    }));
  }

  async getGameDetails(id: string | number): Promise<GameDbGameDetails | null> {
    try {
      const gameId = typeof id === "string" ? parseInt(id, 10) : id;
      const detailsResponse = await this.api.get<DetailedGame>(
        `/games/${gameId}`
      );
      const details = detailsResponse.data;
      const storesResponse = await this.api.get<StoreResponse>(
        `/games/${gameId}/stores`
      );
      const stores = storesResponse.data.results
        .filter((s: { store_id: number }) => this.getStoreName(s.store_id))
        .map((s: { store_id: number; url: string }) => ({
          name: this.getStoreName(s.store_id),
          url: s.url,
        }));
        
      return {
        id: details.id,
        name: details.name,
        released: details.released,
        genres: details.genres?.map((g: Genre) => g.name),
        platforms: details.platforms?.map((p: Platform) => p.platform.name),
        coverUrl: details.background_image,
        description: details.description,
        website: details.website,
        stores,
      };
    } catch (error) {
      console.error("Failed to fetch game details from RAWG:", error);
      return null;
    }
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
